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

    private generate() {
        this.map = this.level.levelGen.genChunk(this.level, this.x, this.y);
        this.isGenerated = true;
        this.map.forEach((lt) => lt.init());
    }

    private moveEntity(entity: Entity, chunk: Chunk) {
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

    public tick(): void {
        this.lastTick = Updater.tickCount;
        for (const lt of this.map) {
            lt.tick();
        }
        let count = 0;
        for (const entity of this.entities) {
            if (!(entity instanceof Entity)) {
                continue;
            }
            if (entity.getRemoved()) {
                continue;
            }
            entity.tick();
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
        this.map.forEach((tile) => {
            tile.visible = false;
            // tile.container.destroy({children: true});
        });
    }

    public load() {
        this.map.forEach((tile) => {
            tile.visible = true;
        });
    }

    public render() {
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
