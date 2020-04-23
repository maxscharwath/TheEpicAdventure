import Updater from "../core/Updater";
import Entity from "../entity/Entity";
import Mob from "../entity/mob/Mob";
import Level from "./Level";
import LevelTile from "./LevelTile";

export default class Chunk {
    private entities: Entity[] = [];
    private readonly x: number;
    private readonly y: number;
    private isGenerated: boolean = false;
    private map: LevelTile[] = [];
    private lastTick = 0;
    private loaded: boolean = false;

    private generate() {
        this.map = this.level.levelGen.genChunk(this.level, this.x, this.y);
        this.isGenerated = true;
        this.map.forEach((lt) => lt.init());
    }

    private moveEntity(entity: Entity, chunk: Chunk) {
        if (!chunk.loaded) {
            entity.remove();
        }
        this.remove(entity);
        chunk.add(entity);
    }

    public static SIZE = 16;
    public readonly level: Level;

    constructor(level: Level, x: number, y: number, generate: boolean = true) {
        console.log("new Chunk!", x, y);
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
        }
    }

    public remove(entity: Entity) {
        this.entities.splice(this.entities.indexOf(entity), 1);
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

    public toJSON() {
        return {
            x: this.x,
            y: this.y,
            entities: this.entities,
            map: this.map,
        };
    }
}
