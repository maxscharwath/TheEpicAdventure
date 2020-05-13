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
import Tiles from "./tile/Tiles";

type Type<T> = new (...args: any[]) => T;
export default class Chunk {
    public static SIZE = 16;

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
    private entities: Entity[] = [];
    private generated: boolean = false;
    private map: LevelTile[] = [];
    private lastTick = 0;
    private loaded: boolean = false;

    constructor(level: Level, x: number, y: number, generate: boolean = true) {
        this.level = level;
        this.lastTick = Updater.tickCount;
        this.x = x;
        this.y = y;
        if (generate) {
            this.generate();
        }
    }

    public getEntities(): Entity[] {
        return this.entities.filter((e) => e.isActive());
    }

    public getTile(x: number, y: number): LevelTile {
        if (!this.isGenerated()) return;
        return this.map[x + y * Chunk.SIZE];
    }

    public isActive() {
        return (Updater.tickCount - this.lastTick) < Chunk.CHUNK_TIMEOUT;
    }

    public isGenerated() {
        return this.generated;
    }

    public onTick(): void {
        if (!this.isGenerated()) return;
        this.lastTick = Updater.tickCount;
        for (const lt of this.map) {
            lt.onTick();
        }
        for (const entity of this.entities) {
            if (!(entity instanceof Entity) || entity.getRemoved() || !entity.getLevel()) continue;
            entity.onTick();
            if (!entity.getRemoved()) this.checkEntity(entity);
        }
    }

    public checkEntity(entity: Entity) {
        const xc = entity.x >> 8;
        const yc = entity.y >> 8;
        if (xc !== this.x || yc !== this.y) {
            this.moveEntity(entity, this.level.getChunk(xc, yc));
        }
    }

    public addEntity(entity: Entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
            if (this.loaded) {
                entity.add();
            }
        }
    }

    public removeEntity(entity: Entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
        entity.remove();
    }

    public destroy() {
        this.loaded = false;
        this.map.forEach((tile) => {
            tile.remove();
            tile.destroy({children: true});
        });
        this.entities.forEach((entity) => {
            entity.remove();
            entity.destroy({children: true});
        });
    }

    public unload() {
        this.loaded = false;
        this.map.forEach((tile) => {
            tile.remove();
        });
        this.entities.forEach((entity) => {
            entity.remove();
        });
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

    public onRender() {
        if (!this.isGenerated()) {
            return;
        }
        this.map.forEach((lt) => lt.onRender());
        for (const entity of this.entities) {
            if (!(entity instanceof Entity) || entity.getRemoved() || !entity.getLevel()) continue;
            entity.onRender();
        }
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
            this.level.addEntity((Entities.get(data.id) as unknown as typeof Entity).create(data));
        }
        console.log(`chunk ${this.x} ${this.y} loaded in ${(System.nanoTime() - t1) / 1000000}ms`);
        this.map = map;
        this.lastTick = Updater.tickCount;
        this.generated = true;
        return this;
    }

    public generate() {
        this.map = this.level.levelGen.genChunk(this.level, this.x, this.y);
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
        entityClass: new (args: any) => T, predicate?: (value: T) => boolean): Promise<T> {
        const entities = this.entities.concat();
        return new Promise((resolve) => {
            const action = () => {
                const entity = entities.shift();
                if (entity instanceof entityClass) {
                    if (predicate instanceof Function && !predicate(entity)) return;
                    return resolve(entity as T);
                }
                if (entities.length > 0) process.nextTick(action);
            };
            process.nextTick(action);
        });
    }

    private moveEntity(entity: Entity, chunk: Chunk) {
        if (!chunk.loaded) {
            entity.remove();
        }
        this.removeEntity(entity);
        chunk.addEntity(entity);
    }
}
