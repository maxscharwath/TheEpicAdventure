import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import System from "../core/System";
import Updater from "../core/Updater";
import {Entity, Player} from "../entity/";
import Random from "../utility/Random";
import Chunk from "./Chunk";
import LevelGen from "./LevelGen";
import LevelTile from "./LevelTile";
import Tile from "./tile/Tile";
import rimraf from "rimraf";
import Tickable from "../entity/Tickable";
import Weather from "../gfx/weather/Weather";
import LightFilter from "../gfx/LightFilter";
import Game from "../core/Game";

export default class Level {
    private static MOB_SPAWN_FACTOR: number = 100;

    public maxMobCount: number = 300;
    public mobCount: number = 0;
    public readonly seed: number;
    public levelGen: LevelGen;
    public gravity = 0.4;
    public container: PIXI.Container = new PIXI.Container();
    public groundContainer: PIXI.Container = new PIXI.Container();
    public sortableContainer: PIXI.Container = new PIXI.Container();
    public weather?: Weather;
    public lightFilter: LightFilter;
    private random: Random = new Random();
    private players: Player[] = [];
    private tickablesToAdd: Tickable[] = [];
    private tickablesToRemove: Tickable[] = [];
    private chunksToRemove: string[] = [];
    private chunks = new Map<string, Chunk>();
    private loadedChunks: Chunk[] = [];

    constructor(seed: number) {
        this.seed = seed;
        this.levelGen = new LevelGen(this.seed);
        this.sortableContainer.sortableChildren = true;
        this.container.addChild(this.groundContainer, this.sortableContainer);
        this.lightFilter = new LightFilter();
    }

    public getChunks() {
        return Array.from(this.chunks.values());
    }

    public getNbChunks(): number {
        return this.chunks.size;
    }

    public deleteTempDir() {
        rimraf.sync(System.getAppData("tmp"));
    }

    public flushInactiveChunks() {
        const chunks: Chunk[] = [];
        this.chunks.forEach((chunk) => {
            if (!chunk.isActive()) {
                chunks.push(chunk);
                this.deleteChunk(chunk);
            }
        });
        return chunks;
    }

    public flushChunks() {
        this.chunksToRemove.push(...this.chunks.keys());
    }

    public getChunksRadius(r: number = 1): Chunk[] {
        const chunks = [];
        for (let x = -r; x < r; x++) {
            for (let y = -r; y < r; y++) {
                const chunk = this.getChunk(
                    x + ((Renderer.camera.x + 16 * 8) >> 8),
                    y + ((Renderer.camera.y + 16 * 8) >> 8));
                if (chunk && chunk.isGenerated() && chunk.isActive()) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }

    public remove(t: Tickable): void {
        this.tickablesToAdd = this.tickablesToAdd.filter((item) => item !== t);
        if (!this.tickablesToRemove.includes(t)) {
            this.tickablesToRemove.push(t);
        }
    }

    public deleteChunk(chunk: Chunk) {
        this.chunksToRemove.push(chunk.x + ":" + chunk.y);
    }

    public getChunk(x: number, y: number, generate = true): Chunk | undefined {
        x = ~~x;
        y = ~~y;
        const id = x + ":" + y;
        if (!this.chunks.has(id)) {
            if (!generate) return undefined;
            const chunk = Chunk.empty(this, x, y);
            Chunk.fileExist(this, x, y)
                .then(() => chunk.fromFile())
                .catch(() => chunk.generate());
            this.chunks.set(id, chunk);
        }
        return this.chunks.get(id);
    }

    public getChunkNeighbour(x: number, y: number): Chunk[] {
        x = ~~x;
        y = ~~y;
        const chunks = [];
        for (let i = x - 1; i < x + 1; i++) {
            for (let j = y - 1; j < y + 1; j++) {
                const chunk = this.getChunk(i, j);
                if (chunk) chunks.push(chunk);
            }
        }
        return chunks;
    }

    public getTile(x: number, y: number, generate = true): LevelTile | undefined {
        const chunk = this.getChunk(x >> 4, y >> 4, generate);
        if (!chunk) return undefined;
        return chunk.getTile(((x % 16) + 16) % 16, ((y % 16) + 16) % 16);
    }

    public getRandomTileInEntityRadius(
        tiles: Array<typeof Tile>,
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
        if (Updater.every(50)) {
            this.flushInactiveChunks();
        }
        const chunks = this.getChunksRadius(1);
        chunks.forEach((chunk) => {
            if (!this.loadedChunks.includes(chunk)) {
                chunk.load();
            }
            chunk.onTick();
        });
        this.loadedChunks.forEach((c) => {
            if (!chunks.includes(c)) {
                c.unload();
            }
        });
        this.loadedChunks = chunks;

        // return;
        const count = 0;

        while (this.tickablesToAdd.length > 0) {
            const tickable: Tickable = this.tickablesToAdd[0];
            tickable.getChunk()?.add(tickable);
            if (tickable instanceof Player && !this.players.includes(tickable)) {
                this.players.push(tickable as Player);
                Game.player = tickable;
            }
            this.tickablesToAdd = this.tickablesToAdd.filter((item) => item !== tickable);
        }

        while (this.tickablesToRemove.length > 0) {
            const tickable: Tickable = this.tickablesToRemove[0];
            tickable.getChunk()?.remove(tickable);
            tickable.delete(this);
            if (tickable instanceof Player) {
                this.players = this.players.filter((item) => item !== tickable);
            }
            this.tickablesToRemove = this.tickablesToRemove.filter((item) => item !== tickable);
        }
        this.mobCount = count;

        if (count < this.maxMobCount) {
            this.trySpawn();
        }
    }

    public onRender() {
        if (!this.players[0]) return;
        if (this.weather) this.weather.onRender();
        this.lightFilter.onRender();
        Renderer.camera.setFollow(Game.player);

        this.loadedChunks.forEach((chunk) => chunk.onRender());
    }

    public add(tickable?: Tickable, x?: number, y?: number, tileCoords: boolean = false): boolean {
        if (!tickable) return false;
        if (x === undefined || y === undefined) {
            x = tickable.x;
            y = tickable.y;
        }
        if (tileCoords) {
            x = x * 16 + 8;
            y = y * 16 + 8;
        }
        tickable.setLevel(this, x, y);
        this.tickablesToRemove = this.tickablesToRemove.filter((item) => item !== tickable);
        if (!this.tickablesToAdd.includes(tickable)) {
            this.tickablesToAdd.push(tickable);
            return true;
        }
        return false;
    }

    public toString(): string {
        return "Level";
    }

    public save() {
        return Promise.all(Array.from(this.chunks).map((chunk) => chunk[1].save()));
    }

    public findEntitiesInRadius(
        predicate: (value: Entity) => boolean, x: number, y: number, radius: number): Promise<Entity[]> {
        const result: Array<Promise<Entity[]>> = [];
        const chunks: Chunk[] = [];
        for (let cx = (x - radius) >> 4; cx <= (x + radius) >> 4; cx++) {
            for (let cy = (y - radius) >> 4; cy <= (y + radius) >> 4; cy++) {
                const chunk = this.getChunk(cx, cy, false);
                if (chunk) chunks.push(chunk);
            }
        }
        return new Promise((resolve) => {
            const action = () => {
                const chunk = chunks.shift();
                if (chunk) {
                    result.push(
                        chunk.findEntities(
                            (e) => predicate(e) && Math.hypot((e.x >> 4) - x, (e.y >> 4) - y) < radius,
                        ),
                    );
                }
                if (chunks.length > 0) return process.nextTick(action);
                Promise.all(result).then((value) => {
                    resolve(value.flat());
                });
            };
            process.nextTick(action);
        });
    }

    public findEntities(predicate: (value: Entity) => boolean): Promise<Entity[]> {
        const chunksId = Array.from(this.chunks.keys());
        const result: Array<Promise<Entity[]>> = [];
        return new Promise((resolve) => {
            const action = () => {
                const chunk = this.chunks.get(chunksId.shift() ?? "");
                if (chunk) result.push(chunk.findEntities(predicate));
                if (chunksId.length > 0) return process.nextTick(action);
                Promise.all(result).then((value) => {
                    resolve(value.flat());
                });
            };
            process.nextTick(action);
        });
    }

    public findEntity<T extends Entity>(
        entityClass: new (...args: any) => T, predicate?: (value: T) => boolean): Promise<T> {
        const chunksId = Array.from(this.chunks.keys());
        return new Promise((resolve) => {
            const action = () => {
                this.chunks.get(chunksId.shift() ?? "")?.findEntity(entityClass, predicate)
                    .then((entity) => resolve(entity as T));
                if (chunksId.length > 0) process.nextTick(action);
            };
            process.nextTick(action);
        });
    }

    private trySpawn(): void {
        const spawnSkipChance = ~~Level.MOB_SPAWN_FACTOR * Math.pow(this.mobCount, 2) / Math.pow(this.maxMobCount, 2);
        if (spawnSkipChance > 0 && this.random.int(spawnSkipChance) !== 0) {
            return;
        }
    }

    private deleteQueuedChunk() {
        while (this.chunksToRemove.length > 0) {
            const chunkId = this.chunksToRemove[0];
            const chunk = this.chunks.get(chunkId);
            if (chunk) {
                chunk.save();
                chunk.destroy();
            }
            this.chunks.delete(chunkId);
            this.chunksToRemove.splice(0, 1);
        }
    }
}
