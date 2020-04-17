import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import Entity from "../entity/Entity";
import Player from "../entity/mob/Player";
import Random from "../utility/Random";
import Chunk from "./Chunk";
import LevelGen from "./LevelGen";
import LevelTile from "./LevelTile";


export default class Level {
    private static MOB_SPAWN_FACTOR: number = 100;
    public w: number;
    public h: number;
    public monsterDensity: number = 16;
    public maxMobCount: number = 300;
    public mobCount: number = 0;
    public readonly seed = 0;
    public levelGen = new LevelGen(this.seed);
    public gravity = 0.4;
    public container: PIXI.Container = new PIXI.Container();
    public tilesContainer: PIXI.Container = new PIXI.Container();
    public entitiesContainer: PIXI.Container = new PIXI.Container();
    private random: Random = new Random();
    private players: Player[] = [];
    private entities: Entity[] = [];
    private entitiesToAdd: Entity[] = [];
    private entitiesToRemove: Entity[] = [];
    private chunks: { [key: string]: Chunk } = {};
    private loadedChunks: Chunk[] = [];

    constructor() {
        Renderer.setLevel(this);
        this.container.addChild(this.tilesContainer, this.entitiesContainer);
    }

    public getEntities(): Entity[] {
        return this.entities;
    }

    public remove(e: Entity): void {
        this.entitiesToAdd.splice(this.entitiesToAdd.indexOf(e), 1);
        if (!this.entitiesToRemove.includes(e)) {
            this.entitiesToRemove.push(e);
        }
    }

    public getChunk(x: number, y: number): Chunk {
        x = ~~x;
        y = ~~y;
        if (!this.chunks[x + ":" + y]) {
            this.chunks[x + ":" + y] = new Chunk(this, x, y);
        }
        return this.chunks[x + ":" + y];
    }

    public getChunkNeighbour(x: number, y: number): Chunk[] {
        x = ~~x;
        y = ~~y;
        const chunks = [];
        for (let i = x - 1; i < x + 1; i++) {
            for (let j = y - 1; j < y + 1; j++) {
                chunks.push(this.getChunk(i, j));
            }
        }
        return chunks;
    }

    public getTile(x: number, y: number): LevelTile {
        return this.getChunk(x >> 4, y >> 4).getTile(((x % 16) + 16) % 16, ((y % 16) + 16) % 16);
    }

    public tick(): void {
        const chunks = this.getChunksRadius(1);
        chunks.forEach((chunk) => {
            if (!this.loadedChunks.includes(chunk)) {
                chunk.load();
            }
            chunk.tick();
        });
        this.loadedChunks.forEach((c) => {
            if (!chunks.includes(c)) {
                c.unload();
            }
        });
        this.loadedChunks = chunks;

        // return;
        const count = 0;

        while (this.entitiesToAdd.length > 0) {
            const entity: Entity = this.entitiesToAdd[0];
            const inLevel: boolean = this.entities.includes(entity);
            if (!inLevel) {
                this.entities.push(entity);
                if (entity instanceof Player) {
                    this.players.push(entity as Player);
                }
            }
            this.entitiesToAdd.splice(this.entitiesToAdd.indexOf(entity), 1);
        }

        // for (let entity of this.entities) {
        //     if (!(entity instanceof Entity)) continue;
        //     entity.tick();
        //     if (entity instanceof Mob)
        //         count++;
        // }

        while (this.entitiesToRemove.length > 0) {
            const entity: Entity = this.entitiesToRemove[0];
            entity.getChunk().remove(entity);
            entity.remove(this);
            this.entities.splice(this.entities.indexOf(entity), 1);

            if (entity instanceof Player) {
                this.players.splice(this.players.indexOf(entity), 1);
            }

            this.entitiesToRemove.splice(this.entitiesToRemove.indexOf(entity), 1);
        }

        this.mobCount = count;

        if (count < this.maxMobCount) {
            this.trySpawn();
        }
        this.entitiesContainer.children.sort((a, b) => a.zIndex - b.zIndex);
    }

    public render() {
        if (!this.players[0]) {
            return;
        }
        Renderer.camera.setContainer(this.container);
        Renderer.camera.setFollow(this.players[0]);
    }

    public add(entity: Entity, x: number = null, y: number = null, tileCoords: boolean = false): void {
        if (entity == null) {
            return;
        }
        if (x == null || y == null) {
            x = entity.x;
            y = entity.y;
        }
        if (tileCoords) {
            x = x * 16 + 8;
            y = y * 16 + 8;
        }
        entity.setLevel(this, x, y);
        this.getChunk(x >> 8, y >> 8).add(entity);

        this.entitiesToRemove.splice(this.entitiesToRemove.indexOf(entity), 1);
        if (!this.entitiesToAdd.includes(entity)) {
            this.entitiesToAdd.push(entity);
        }
    }

    public toString(): string {
        return "Level";
    }

    public toJSON() {
        return {
            chunks: this.chunks,
        };
    }

    public save() {
        return JSON.stringify(this);
    }

    private getChunksRadius(r: number = 1): Chunk[] {
        const chunks = [];
        for (let x = -r; x < r; x++) {
            for (let y = -r; y < r; y++) {
                chunks.push(this.getChunk(
                    x + ((Renderer.camera.x + 16 * 8) >> 8),
                    y + ((Renderer.camera.y + 16 * 8) >> 8)));
            }
        }
        return chunks;
    }

    private trySpawn(): void {
        const spawnSkipChance = ~~Level.MOB_SPAWN_FACTOR * Math.pow(this.mobCount, 2) / Math.pow(this.maxMobCount, 2);
        if (spawnSkipChance > 0 && this.random.int(spawnSkipChance) !== 0) {
            return;
        }
    }
}
