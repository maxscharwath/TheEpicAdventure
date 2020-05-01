import BSON from "bson";
import fs, {promises as fsp} from "fs";
import {gzip, ungzip} from "node-gzip";
import System from "../core/System";
import Updater from "../core/Updater";
import Entities from "../entity/Entities";
import Entity from "../entity/Entity";
import Mob from "../entity/mob/Mob";
import RLE from "../utility/RLE";
import Biome from "./biome/Biome";
import Level from "./Level";
import LevelTile from "./LevelTile";
import Tiles from "./tile/Tiles";

export default class Chunk {
    private entities: Entity[] = [];
    private generated: boolean = false;
    private map: LevelTile[] = [];
    private lastTick = 0;
    private loaded: boolean = false;

    private generate() {
        this.map = this.level.levelGen.genChunk(this.level, this.x, this.y);
        this.save();
        this.generated = true;
        this.map.forEach((lt) => lt.init());
    }

    private moveEntity(entity: Entity, chunk: Chunk) {
        if (!chunk.loaded) {
            entity.remove();
        }
        this.removeEntity(entity);
        chunk.addEntity(entity);
    }

    public static SIZE = 16;

    public static fromFile(level: Level, cX: number, cY: number): Chunk {
        const chunk = new Chunk(level, cX, cY, false);
        fsp.readFile(System.getAppData("tmp", `c.${cX}.${cY}.bin`))
            .then((buffer) => ungzip(buffer))
            .then((buffer) => {
                const bson = BSON.deserialize(buffer);
                const map: LevelTile[] = [];
                const oX = cX * Chunk.SIZE;
                const oY = cY * Chunk.SIZE;
                const t1 = System.nanoTime();
                const biomes = RLE.decode(bson.biomes.buffer);
                RLE.decode(bson.tiles.buffer, (id, index) => {
                    const x = oX + index % Chunk.SIZE;
                    const y = oY + ~~(index / Chunk.SIZE);

                    const moisture = bson.moisture.buffer[index];
                    const temperature = bson.temperature.buffer[index];
                    const elevation = bson.elevation.buffer[index];
                    const biome = Biome.get(biomes[index]);

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
                });
                for (const data of bson.entities) {
                    level.add((Entities.get(data.id) as typeof Entity).create(data));
                }
                console.log(`chunk ${cX} ${cY} loaded in ${(System.nanoTime() - t1) / 1000000}ms`);
                chunk.generated = true;
                chunk.map = map;
            }).catch((e) => {
            chunk.generate();
        });
        return chunk;
    }

    public readonly x: number;
    public readonly y: number;

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
        return (Updater.tickCount - this.lastTick) < 500;
    }

    public isGenerated() {
        return this.generated;
    }

    public onTick(): void {
        if (!this.isGenerated()) {
            return;
        }
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
            if (!(entity instanceof Entity) || entity.getRemoved()) {
                continue;
            }
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
        const bson = BSON.serialize({
            x: this.x,
            y: this.y,
            tiles,
            biomes,
            elevation: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.elevation)).buffer),
            moisture: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.moisture)).buffer),
            temperature: Buffer.from(Uint8Array.from(this.map.map((lt) => lt.temperature)).buffer),
            entities: this.entities,
        });
        if (!fs.existsSync(System.getAppData("tmp"))) {
            fs.mkdirSync(System.getAppData("tmp"));
        }
        gzip(bson).then((buffer) => fsp.writeFile(System.getAppData("tmp", `c.${this.x}.${this.y}.bin`), buffer, "binary"));
    }
}
