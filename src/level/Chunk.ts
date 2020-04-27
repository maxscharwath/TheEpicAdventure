import BSON from "bson";
import fs from "fs";
import System from "../core/System";
import Updater from "../core/Updater";
import Entity from "../entity/Entity";
import Mob from "../entity/mob/Mob";
import Biome from "./biome/Biome";
import Level from "./Level";
import LevelTile from "./LevelTile";
import Tiles from "./tile/Tiles";

export default class Chunk {
    protected entities: Entity[] = [];
    protected readonly x: number;
    protected readonly y: number;
    protected isGenerated: boolean = false;
    protected map: LevelTile[] = [];
    protected lastTick = 0;
    protected loaded: boolean = false;

    private generate() {
        this.map = this.level.levelGen.genChunk(this.level, this.x, this.y);
        this.isGenerated = true;
        this.map.forEach((lt) => lt.init());
        this.save();
    }

    private moveEntity(entity: Entity, chunk: Chunk) {
        if (!chunk.loaded) {
            entity.remove();
        }
        this.remove(entity);
        chunk.add(entity);
    }

    public static SIZE = 16;

    public static fromFile(level: Level, cX: number, cY: number): Chunk {
        try {
            const bson = BSON.deserialize(fs.readFileSync(`./tmp/c.${cX}.${cY}.bson`));
            const b = bson.tiles.buffer;
            const buffer = new Uint16Array(b.buffer, b.byteOffset, b.byteLength / Uint16Array.BYTES_PER_ELEMENT);

            const chunk = new Chunk(level, cX, cY, false);

            const map: LevelTile[] = [];
            const oX = cX * Chunk.SIZE;
            const oY = cY * Chunk.SIZE;
            const t1 = System.nanoTime();
            for (const v of buffer) {
                const nb = ((v >> 8) & 0b11111111);
                const id = (v & 0b11111111);
                for (let i = 0; i < nb; i++) {
                    const index = map.length;
                    const x = oX + index % Chunk.SIZE;
                    const y = oY + ~~(index / Chunk.SIZE);

                    const moisture = bson.moisture.buffer[index];
                    const temperature = bson.temperature.buffer[index];
                    const elevation = bson.elevation.buffer[index];
                    const biome = Biome.get(bson.biome.buffer[index]);

                    const lt = new LevelTile({
                        x,
                        y,
                        level,
                        tileClass: Tiles.get(id),
                        moisture,
                        temperature,
                        elevation,
                        biome,
                    });
                    lt.init();
                    map.push(lt);
                }
            }
            console.log(`chunk ${cX} ${cY} loaded in ${(System.nanoTime() - t1) / 1000000}ms`);
            chunk.isGenerated = true;
            chunk.map = map;
            return chunk;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    public readonly level: Level;

    constructor(level: Level, x: number, y: number, generate: boolean = true) {
        this.level = level;
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
        return this.map[x + y * Chunk.SIZE];
    }

    public isActive() {
        return (Updater.tickCount - this.lastTick) < 50;
    }

    public onTick(): void {
        this.lastTick = Updater.tickCount;
        for (const lt of this.map) {
            lt.onTick();
        }
        let count = 0;
        for (const entity of this.entities) {
            if (!(entity instanceof Entity)) {
                continue;
            }
            if (entity.getRemoved()) {
                continue;
            }
            entity.onTick();
            if (entity instanceof Mob) {
                count++;
            }
            if (entity.getRemoved()) {

            } else {
                this.checkEntity(entity);
            }
        }
    }

    public checkEntity(entity: Entity) {
        const xc = entity.x >> 8;
        const yc = entity.y >> 8;
        if (xc !== this.x || yc !== this.y) {
            this.moveEntity(entity, this.level.getChunk(xc, yc));
        }
    }

    public add(entity: Entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
            if (this.loaded) {
                entity.add();
            }
        }
    }

    public remove(entity: Entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
        entity.remove();
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
        this.loaded = true;
        this.map.forEach((tile) => {
            tile.add();
        });
        this.entities.forEach((entity) => {
            entity.add();
        });
    }

    public onRender() {
        this.map.forEach((lt) => lt.onRender());
        for (const entity of this.entities) {
            if (!(entity instanceof Entity) || entity.getRemoved()) {
                continue;
            }
            entity.onRender();
        }
    }

    public save() {
        const data = [];
        for (let index = 0, howMany = 0; index < this.map.length; index++) {
            const aV = this.map[index + 1];
            const cV = this.map[index];
            howMany++;
            if (cV?.getTileClass() !== aV?.getTileClass()) {
                data.push(((howMany) << 8) + Tiles.getKeys(cV.getTileClass()).idx);
                howMany = 0;
            }
        }
        const buffer = Buffer.from(Uint16Array.from(data).buffer);
        const bson = BSON.serialize({
            tiles: buffer,
            biome: Buffer.from(Uint8Array.from(this.map.map((lt) => Biome.getKeys(lt.biome).idx)).buffer),
            elevation: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.elevation)).buffer),
            moisture: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.moisture)).buffer),
            temperature: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.temperature)).buffer),
        });
        fs.writeFile(`./tmp/c.${this.x}.${this.y}.bson`, bson, "binary", () => {
        });
    }
}
