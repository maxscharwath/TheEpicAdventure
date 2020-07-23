import BSON from "bson";
import fs, {promises as fsp} from "fs";
import {gzip, ungzip} from "node-gzip";
import System from "../core/System";
import Updater from "../core/Updater";
import Entities from "../entity/Entities";
import Entity from "../entity/Entity";
import RLE from "../utility/RLE";
import Biome from "./biome/Biome";
import Level from "./Level";
import LevelTile from "./LevelTile";
import Tiles, {TileRegister} from "./tile/Tiles";
import Particle from "../entity/particle/Particle";
import Tickable from "../entity/Tickable";
import Tile from "./tile/Tile";
import {Mob, Player} from "../entity";

export default class Chunk {
    public static SIZE = 16;
    public static MOB_CAP = 32;

    public static fileExist(level: Level, cX: number, cY: number) {
        return fsp.access(System.getAppData("tmp", `c.${cX}.${cY}.bin`));
    }

    public static empty(level: Level, cX: number, cY: number): Chunk {
        return new Chunk(level, cX, cY, false);
    }

    public static fromFile(level: Level, cX: number, cY: number): Chunk {
        const chunk = this.empty(level, cX, cY);
        chunk.fromFile();
        return chunk;
    }

    public static generate(level: Level, cX: number, cY: number) {
        return new Chunk(level, cX, cY, true);
    }
    private static CHUNK_TIMEOUT: number = 500;
    public readonly x: number;
    public readonly y: number;
    public readonly level: Level;
    private mobCap: number = 0;
    private particles: Particle[] = [];
    private entities: Entity[] = [];
    private generated: boolean = false;
    private map: LevelTile[] = [];
    private lastTick = 0;
    private loaded: boolean = false;

    constructor(level: Level, x: number, y: number, generate: boolean = true) {
        this.level = level;
        this.lastTick = Updater.ticks;
        this.x = x;
        this.y = y;
        if (generate) {
            this.generate();
        }
    }

    public getEntities(): Entity[] {
        return this.entities.filter((e) => e.isActive());
    }

    public getTile(x: number, y: number): LevelTile | undefined {
        if (!this.isGenerated()) return;
        return this.map[x + y * Chunk.SIZE];
    }

    public isActive() {
        return (Updater.ticks - this.lastTick) < Chunk.CHUNK_TIMEOUT;
    }

    public isGenerated() {
        return this.generated;
    }

    public onTick(): void {
        if (!this.isGenerated()) return;
        this.lastTick = Updater.ticks;
        for (const lt of this.map) {
            lt.onTick();
        }
        for (const entity of this.entities) {
            if (!(entity instanceof Entity) || entity.getRemoved() || !entity.getLevel()) continue;
            entity.onTick();
            if (!entity.getRemoved()) this.checkEntity(entity);
        }
        for (const particle of this.particles) {
            if (!(particle instanceof Particle) || particle.getRemoved() || !particle.getLevel()) continue;
            particle.onTick();
        }
    }

    public onRender() {
        if (!this.isGenerated()) return;
        this.map.forEach((lt) => lt.onRender());
        for (const entity of this.entities) {
            if (!(entity instanceof Entity) || entity.getRemoved() || !entity.getLevel()) continue;
            entity.onRender();
        }
        for (const particle of this.particles) {
            if (!(particle instanceof Particle) || particle.getRemoved() || !particle.getLevel()) continue;
            particle.onRender();
        }
    }

    public checkEntity(entity: Entity) {
        const xc = entity.x >> 8;
        const yc = entity.y >> 8;
        if (xc !== this.x || yc !== this.y) {
            const chunk = this.level.getChunk(xc, yc);
            if (chunk) {
                this.moveEntity(entity, chunk);
            }
        }
    }

    public add(tickable: Tickable) {
        if (tickable instanceof Entity) {
            if (!this.entities.includes(tickable)) {
                if (tickable instanceof Mob && !(tickable instanceof Player)) {
                    this.mobCap++;
                }
                this.entities.push(tickable);
                if (this.loaded) tickable.add();
            }
        }
        if (tickable instanceof Particle) {
            if (!this.particles.includes(tickable)) {
                this.particles.push(tickable);
                if (this.loaded) tickable.add();
            }
        }
    }

    public remove(tickable: Tickable) {
        if (tickable instanceof Entity) {
            this.entities = this.entities.filter((item) => item !== tickable);
            if (tickable instanceof Mob && !(tickable instanceof Player)) {
                this.mobCap--;
            }
        }
        if (tickable instanceof Particle) this.particles = this.particles.filter((item) => item !== tickable);
        tickable.remove();
    }

    public destroy() {
        this.loaded = false;
        this.generated = false;
        this.map.forEach((tile) => {
            tile.remove();
            tile.destroy();
        });
        [].concat(this.entities, this.particles).forEach((tickable: Tickable) => {
            tickable.remove();
            tickable.destroy({children: true});
        });
        this.entities = [];
        this.particles = [];
        this.map = [];
    }

    public async reload() {
        this.loaded = false;
        this.generated = false;
        await this.save();
        this.destroy();
        return this.fromFile();
    }

    public unload() {
        this.loaded = false;
        this.map.forEach((tile) => {
            tile.remove();
        });
        this.entities.forEach((entity) => {
            entity.remove();
        });
        this.particles.forEach((particle) => {
            particle.remove();
            particle.destroy({children: true});
        });
        this.particles = [];
    }

    public load() {
        if (!this.generated) return;
        this.loaded = true;
        this.map.forEach((tile) => {
            tile.add();
        });
        this.entities.forEach((entity) => {
            entity.add();
        });
    }

    public save() {
        const tiles = RLE.encode(
            this.map,
            (a, b) => a?.getTileClass() === b?.getTileClass(),
            (a) => Tiles.getKeys(a.getTileClass()).idx,
        );
        const biomes = RLE.encode(
            this.map.map((lt) => Biome.getKeys(lt.biome).idx),
            (a, b) => a === b,
            (a) => a,
        );

        const tileStates = this.map.reduce((result, lt, index) => {
            const data = lt.tile?.states.toBSON();
            return data ? [...result, [index, data]] : result;
        }, []);

        const bson = BSON.serialize({
            x: this.x,
            y: this.y,
            tiles,
            tileStates,
            biomes,
            elevation: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.elevation)).buffer),
            moisture: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.moisture)).buffer),
            temperature: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.temperature)).buffer),
            entities: this.entities,
        });
        if (!fs.existsSync(System.getAppData("tmp"))) {
            fs.mkdirSync(System.getAppData("tmp"));
        }
        return gzip(bson).then((buffer) => fsp.writeFile(System.getAppData("tmp", `c.${this.x}.${this.y}.bin`), buffer, "binary"));
    }

    public async fromFile() {
        const fileBuffer = await fsp.readFile(System.getAppData("tmp", `c.${this.x}.${this.y}.bin`));
        const ungzipBuffer = await ungzip(fileBuffer);
        const bson = BSON.deserialize(ungzipBuffer);
        const map: LevelTile[] = [];
        const oX = this.x * Chunk.SIZE;
        const oY = this.y * Chunk.SIZE;
        const t1 = System.nanoTime();
        const biomes = RLE.decode(bson.biomes.buffer);
        RLE.decode(bson.tiles.buffer, (id, index) => {
            const x = oX + index % Chunk.SIZE;
            const y = oY + ~~(index / Chunk.SIZE);
            const moisture = bson.moisture.buffer[index];
            const temperature = bson.temperature.buffer[index];
            const elevation = bson.elevation.buffer[index];
            const biome = Biome.get(biomes[index]);
            const tileStates = bson.tileStates.find((v: any) => v[0] === index)?.[1];
            const lt = new LevelTile({
                x,
                y,
                level: this.level,
                tileClass: Tiles.get(id),
                moisture,
                temperature,
                elevation,
                biome,
                tileStates,
            });
            lt.init();
            map.push(lt);
        });
        for (const data of bson.entities) {
            const entity = (Entities.get(data.id) as unknown as typeof Entity);
            if (!entity) continue;
            this.add(entity.create(data));
        }
        console.log(`chunk ${this.x} ${this.y} loaded in ${(System.nanoTime() - t1) / 1000000}ms`);
        this.map = map;
        this.lastTick = Updater.ticks;
        this.generated = true;
        return this;
    }

    public async generate() {
        this.map = this.level.levelGen.genChunk(this.x, this.y, this.level);
        this.save();
        this.map.forEach((lt) => lt.init());
        this.generated = true;
        return this;
    }

    public findEntities(predicate: (value: Entity) => boolean): Promise<Entity[]> {
        const entities = this.entities.concat();
        const result: Entity[] = [];
        return new Promise((resolve) => {
            const action = () => {
                const entity = entities.shift();
                if (entity instanceof Entity && predicate(entity)) result.push(entity);
                if (entities.length > 0) return process.nextTick(action);
                resolve(result);
            };
            process.nextTick(action);
        });
    }

    public findEntity<T extends Entity>(
        entityClass: new (...args: any) => T, predicate?: (value: T) => boolean): Promise<T> {
        const entities = this.entities.concat();
        return new Promise((resolve) => {
            const action = () => {
                const entity = entities.shift();
                if (entity instanceof entityClass) {
                    return predicate instanceof Function && !predicate(entity) ? undefined : resolve(entity as T);
                }
                if (entities.length > 0) process.nextTick(action);
            };
            process.nextTick(action);
        });
    }

    public findTiles(
        tiles: TileRegister<typeof Tile>[], predicate?: (value: LevelTile) => boolean): Promise<LevelTile[]> {
        const map = this.map.concat();
        const result: LevelTile[] = [];
        return new Promise((resolve) => {
            const action = () => {
                const tile = map.shift();
                if (tile.instanceOf(...tiles) && predicate instanceof Function && predicate(tile)) result.push(tile);
                if (map.length > 0) return process.nextTick(action);
                resolve(result);
            };
            process.nextTick(action);
        });
    }

    public findTile(
        tiles: TileRegister<typeof Tile>[], predicate?: (value: LevelTile) => boolean): Promise<LevelTile> {
        const map = this.map.concat();
        return new Promise((resolve) => {
            const action = () => {
                const tile = map.shift();
                if (tile.instanceOf(...tiles)) {
                    return predicate instanceof Function && !predicate(tile) ? undefined : resolve(tile);
                }
                if (map.length > 0) process.nextTick(action);
            };
            process.nextTick(action);
        });
    }

    private async wait(time: number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    private moveEntity(entity: Entity, chunk: Chunk) {
        if (!chunk.loaded) {
            entity.remove();
        }
        this.remove(entity);
        chunk.add(entity);
    }
}
