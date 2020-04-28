import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import {Entity, Player} from "../entity/";
import Random from "../utility/Random";
import Chunk from "./Chunk";
import LevelGen from "./LevelGen";
import LevelTile from "./LevelTile";
import Tile from "./tile/Tile";

type Type<T> = new (...args: any[]) => T;
export default class Level {
    private static MOB_SPAWN_FACTOR: number = 100;
    private random: Random = new Random();
    private players: Player[] = [];
    private entitiesToAdd: Entity[] = [];
    private entitiesToRemove: Entity[] = [];
    private chunksToRemove: string[] = [];
    private chunks: { [key: string]: Chunk } = {};
    private loadedChunks: Chunk[] = [];

    private trySpawn(): void {
        const spawnSkipChance = ~~Level.MOB_SPAWN_FACTOR * Math.pow(this.mobCount, 2) / Math.pow(this.maxMobCount, 2);
        if (spawnSkipChance > 0 && this.random.int(spawnSkipChance) !== 0) {
            return;
        }
    }

    private deleteQueuedChunk() {
        while (this.chunksToRemove.length > 0) {
            const chunkId = this.chunksToRemove[0];
            const chunk = this.chunks[chunkId];
            if (chunk) {
                chunk.save();
                chunk.destroy();
            }
            delete this.chunks[chunkId];
            this.chunksToRemove.splice(0, 1);
        }
    }

    public maxMobCount: number = 300;
    public mobCount: number = 0;
    public readonly seed = 0;
    public levelGen = new LevelGen(this.seed);
    public gravity = 0.4;
    public container: PIXI.Container = new PIXI.Container();
    public tilesContainer: PIXI.Container = new PIXI.Container();
    public entitiesContainer: PIXI.Container = new PIXI.Container();

    constructor() {
        Renderer.setLevel(this);
        this.container.addChild(this.tilesContainer, this.entitiesContainer);
    }

    public flushChunks() {
        this.chunksToRemove.push(...Object.keys(this.chunks));
    }

    public getChunksRadius(r: number = 1): Chunk[] {
        const chunks = [];
        for (let x = -r; x < r; x++) {
            for (let y = -r; y < r; y++) {
                const chunk = this.getChunk(
                    x + ((Renderer.camera.x + 16 * 8) >> 8),
                    y + ((Renderer.camera.y + 16 * 8) >> 8));
                if (chunk.isActive()) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }

    public remove(e: Entity): void {
        this.entitiesToAdd.splice(this.entitiesToAdd.indexOf(e), 1);
        if (!this.entitiesToRemove.includes(e)) {
            this.entitiesToRemove.push(e);
        }
    }

    public deleteChunk(x: number, y: number) {
        this.chunksToRemove.push(x + ":" + y);
    }

    public getChunk(x: number, y: number, generate = true): Chunk {
        x = ~~x;
        y = ~~y;
        if (!this.chunks[x + ":" + y]) {
            if (!generate) {
                return undefined;
            }
            this.chunks[x + ":" + y] = Chunk.fromFile(this, x, y);
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

    public getTile(x: number, y: number, generate = true): LevelTile {
        const chunk = this.getChunk(x >> 4, y >> 4, generate);
        if (!chunk) {
            return undefined;
        }
        return chunk.getTile(((x % 16) + 16) % 16, ((y % 16) + 16) % 16);
    }

    public getRandomTileInEntityRadius(
        tiles: Array<Type<Tile>>,
        entity: Entity,
        radiusEnd: number,
        radiusStart = 0,
    ): LevelTile | false {
        if (!(entity instanceof Entity) || radiusStart >= radiusEnd) {
            return false;
        }

        const i = performance.now();
        while (true) {
            const rx = Random.int(radiusEnd * 2) - radiusEnd;
            const ry = Random.int(radiusEnd * 2) - radiusEnd;
            if (Math.abs(rx) < radiusStart || Math.abs(ry) < radiusStart) {
                continue;
            }
            const x = (entity.x >> 4) + rx;
            const y = (entity.y >> 4) + ry;

            const lt = this.getTile(x, y, false);
            if (lt) {
                if (lt.instanceOf(...tiles)) {
                    return lt;
                }
            }

            if ((performance.now() - i) > 5) {
                return false;
            }
        }
    }

    public onTick(): void {
        this.deleteQueuedChunk();
        const chunks = this.getChunksRadius(1);
        chunks.forEach((chunk) => {
            if (!this.loadedChunks.includes(chunk)) {
                chunk.load();
            }
            chunk.onTick();
        });
        this.loadedChunks.forEach((c) => {
            if (!chunks.includes(c)) {
                // c.unload();
                this.deleteChunk(c.x, c.y);
            }
        });
        this.loadedChunks = chunks;

        // return;
        const count = 0;

        while (this.entitiesToAdd.length > 0) {
            const entity: Entity = this.entitiesToAdd[0];
            entity.getChunk().addEntity(entity);
            if (entity instanceof Player && !this.players.includes(entity)) {
                this.players.push(entity as Player);
            }
            this.entitiesToAdd.splice(this.entitiesToAdd.indexOf(entity), 1);
        }

        while (this.entitiesToRemove.length > 0) {
            const entity: Entity = this.entitiesToRemove[0];
            entity.getChunk().removeEntity(entity);
            entity.delete(this);
            if (entity instanceof Player) {
                this.players.splice(this.players.indexOf(entity), 1);
            }

            this.entitiesToRemove.splice(this.entitiesToRemove.indexOf(entity), 1);
        }

        this.mobCount = count;

        if (count < this.maxMobCount) {
            this.trySpawn();
        }
    }

    public onRender() {
        if (!this.players[0]) {
            return;
        }
        Renderer.camera.setContainer(this.container);
        Renderer.camera.setFollow(this.players[0]);

        this.loadedChunks.forEach((chunk) => chunk.onRender());
        this.entitiesContainer.children.sort((a, b) => a.zIndex - b.zIndex);
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
        this.entitiesToRemove.splice(this.entitiesToRemove.indexOf(entity), 1);
        if (!this.entitiesToAdd.includes(entity)) {
            this.entitiesToAdd.push(entity);
        }
    }

    public toString(): string {
        return "Level";
    }

    public save() {
        return JSON.stringify(this);
    }
}
