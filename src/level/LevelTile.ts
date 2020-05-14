import * as PIXI from "pixi.js";
import Entity from "../entity/Entity";
import TileRandom from "../utility/TileRandom";
import Biome from "./biome/Biome";
import Level from "./Level";
import Tile from "./tile/Tile";
import {TileRegister} from "./tile/Tiles";

interface LevelTileConstructor {
    level: Level;
    x: number;
    y: number;
    biome: Biome;
    temperature: number;
    elevation: number;
    moisture: number;
    tileClass?: typeof Tile;
    tileStates?: {};
}

export default class LevelTile extends PIXI.Container {

    get tile(): Tile | undefined {
        return this._tile;
    }

    public static SIZE = 16;
    public skipTick: boolean = false;
    public biome: Biome;
    public data: object = {};
    public level: Level;
    public random: TileRandom = new TileRandom(this);
    public readonly temperature: number;
    public readonly elevation: number;
    public readonly moisture: number;
    public readonly x: number;
    public readonly y: number;
    public bg?: PIXI.Sprite;
    private tileStates?: {};
    private tileClass?: typeof Tile;
    private needToUpdate: boolean = true;
    private isInitiated = false;

    private _tile?: Tile;

    constructor({level, x, y, biome, temperature, elevation, moisture, tileClass, tileStates}: LevelTileConstructor) {
        super();
        this.biome = biome;
        this.temperature = temperature;
        this.elevation = elevation;
        this.moisture = moisture;
        this.x = x << 4;
        this.y = y << 4;
        this.level = level;
        this.tileClass = tileClass;
        this.tileStates = tileStates;
    }

    public init() {
        if (this.tileClass && !(this.tileClass.prototype instanceof Tile)) {
            throw new Error("Cannot initialize LevelTile: Wrong Tile");
        }
        // @ts-ignore
        this._tile = new this.tileClass(this);
        this._tile?.states.set(this.tileStates);
        this.isInitiated = true;
        process.nextTick(() => {
            this.removeChildren();
            this.bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            this.bg.width = LevelTile.SIZE;
            this.bg.height = LevelTile.SIZE;
            this.bg.tint = this.biome.color.getInt();
            this.addChild(this.bg);
            if (this._tile) {
                this._tile.init();
                this.addChild(this._tile.container);
            }
            this.update();
        });
    }

    public remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public add() {
        if (!this.level) {
            return;
        }
        this.level.tilesContainer.addChild(this);
    }

    public getLocalX() {
        return this.x >> 4;
    }

    public getLocalY() {
        return this.y >> 4;
    }

    public steppedOn(entity: Entity) {
        this._tile?.steppedOn(entity);
    }

    public is(...tileClasses: Array<typeof Tile>) {
        return tileClasses.some((tileClass) => this._tile?.getClass() === tileClass);
    }

    public setTile<T extends typeof Tile>(tile: T, states?: typeof tile.DEFAULT_STATES): void;
    public setTile<T extends typeof Tile>(tile: TileRegister<T>, states?: typeof tile.tile.DEFAULT_STATES): void;
    public setTile<T extends typeof Tile>(tile: T | TileRegister<T>, states?: {}): void {
        this.isInitiated = false;
        this.skipTick = true;
        this.tileClass = (tile instanceof TileRegister) ? tile.tile : tile;
        this.tileStates = states;
    }

    public findTileRadius(radius: number, ...tiles: Array<typeof Tile>) {
        for (let x = -radius; x < radius; x++) {
            const height = ~~(Math.sqrt(radius * radius - x * x));
            for (let y = -height; y < height; y++) {
                const lt = this.getRelativeTile(x, y, false);
                if (lt && lt.instanceOf(...tiles)) {
                    return true;
                }
            }
        }
        return false;
    }

    public getTileClass() {
        return this.tileClass;
    }

    public onTick() {
        if (!this.isInitiated) {
            this.init();
        }
        if (this.skipTick) {
            this.skipTick = false;
            return;
        }
        if (this._tile?.isInit) {
            this._tile?.onTick();
        }
    }

    public onUpdate() {
        if (this._tile?.isInit) {
            this._tile?.onUpdate();
        }
    }

    public onRender() {
        if (!this.isInitiated) {
            this.init();
        }
        if (this.needToUpdate) {
            this.needToUpdate = false;
            this.onUpdate();
        }
        if (this._tile?.isInit) {
            this._tile?.onRender();
        }
    }

    public getRelativeTile(x: number, y: number, generate = true): LevelTile | undefined {
        return this.level.getTile(this.getLocalX() + x, this.getLocalY() + y, generate);
    }

    public getNeighbourTiles(radius: number = 1, generate = true): LevelTile[] {
        const lt = [];
        const x = this.getLocalX();
        const y = this.getLocalY();
        for (let i = x - radius; i <= x + radius; i++) {
            for (let j = y - radius; j <= y + radius; j++) {
                if (i === x && j === y) {
                    continue;
                }
                const t = this.level.getTile(i, j, generate);
                if (t) {
                    lt.push(t);
                }
            }
        }
        return lt;
    }

    public getDirectNeighbourTiles(generate = true): LevelTile[] {
        const lt = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (Math.abs(i) === Math.abs(j)) {
                    continue;
                }
                const t = this.getRelativeTile(i, j, generate);
                if (t) {
                    lt.push(t);
                }
            }
        }
        return lt;
    }

    public mayPass(entity: Entity) {
        return this._tile?.mayPass(entity);
    }

    public bumpedInto(entity: Entity) {
        return this._tile?.bumpedInto(entity);
    }

    public getFriction() {
        return this._tile?.friction ?? 1;
    }

    public instanceOf(...tileClass: Array<typeof Tile>) {
        return this._tile?.instanceOf(...tileClass);
    }

    public update() {
        this.needToUpdate = true;
        this.getNeighbourTiles(1, false).forEach((levelTile) => {
            levelTile.needToUpdate = true;
        });
    }
}
