import * as PIXI from "pixi.js";
import Entity from "../entity/Entity";
import TileRandom from "../utility/TileRandom";
import Biome from "./biome/Biome";
import Level from "./Level";
import Tile from "./tile/Tile";
import {TileRegister} from "./tile/Tiles";
import {EventEmitter} from "events";
import Light from "../gfx/Light";

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

export default class LevelTile {

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        this.groundContainer.x = this._x;
        this.sortableContainer.x = this._x;
        this.lightSprite.x = this._x;
        this.sort();
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        this.groundContainer.y = this._y;
        this.sortableContainer.y = this._y;
        this.lightSprite.y = this._y;
        this.sort();
    }

    get tile(): Tile | undefined {
        return this._tile;
    }

    public static SIZE = 16;
    public skipTick: boolean = false;
    public biome: Biome;
    public level: Level;
    public random: TileRandom = new TileRandom(this);
    public readonly temperature: number;
    public readonly elevation: number;
    public readonly moisture: number;
    public lightLevel = 0;
    private initByEntity?: Entity;
    private events = new EventEmitter();
    private tileStates?: {};
    private tileClass?: typeof Tile;
    private needToUpdate: boolean = true;
    private isInitiated = false;
    private groundContainer = new PIXI.Container();
    private sortableContainer = new PIXI.Container();
    private lightSprite = new Light();

    private _x: number;

    private _y: number;

    private _tile?: Tile;

    constructor({level, x, y, biome, temperature, elevation, moisture, tileClass, tileStates}: LevelTileConstructor) {
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
        const oldTile = this._tile;
        // @ts-ignore
        this._tile = new this.tileClass(this);
        this._tile?.states.set(this.tileStates);
        this.isInitiated = true;
        process.nextTick(() => {
            this.groundContainer.removeChildren();
            this.sortableContainer.removeChildren();

            if (this._tile) {
                this._tile.init();
                this.sort();
                if (this.initByEntity || oldTile) {
                    this._tile.onSetTile(oldTile, this.initByEntity);
                    this.initByEntity = undefined;
                }
                this.groundContainer.addChild(this._tile.container);
                this.sortableContainer.addChild(this._tile.sortableContainer);
            }
            this.update();
        });
    }

    public remove() {
        if (this.groundContainer.parent) this.groundContainer.parent.removeChild(this.groundContainer);
        if (this.sortableContainer.parent) this.sortableContainer.parent.removeChild(this.sortableContainer);
        if (this.lightSprite.parent) this.lightSprite.parent.removeChild(this.lightSprite);
    }

    public add() {
        if (!this.level) {
            return;
        }
        this.level.groundContainer.addChild(this.groundContainer);
        this.level.sortableContainer.addChild(this.sortableContainer);
        this.level.lightFilter.lightContainer.addChild(this.lightSprite);
    }

    public getLocalX = () => this._x >> 4;

    public getLocalY = () => this._y >> 4;

    public steppedOn(entity: Entity) {
        this._tile?.steppedOn(entity);
    }

    public is(...tileClasses: Array<typeof Tile>) {
        return tileClasses.some((tileClass) => this._tile?.getClass() === tileClass);
    }

    public setTile<T extends typeof Tile>(tile: T, states?: typeof tile.DEFAULT_STATES, entity?: Entity): void;
    public setTile<T extends typeof Tile>(
        tile: TileRegister<T>, states?: typeof tile.tile.DEFAULT_STATES, entity?: Entity): void;
    public setTile<T extends typeof Tile>(tile: T | TileRegister<T>, states?: {}, entity?: Entity): void {
        this.isInitiated = false;
        this.skipTick = true;
        this.tileClass = (tile instanceof TileRegister) ? tile.tile : tile;
        this.tileStates = states;
        this.initByEntity = entity;
    }

    public findTileRadius(radius: number, ...tiles: Array<typeof Tile>) {
        for (let x = -radius; x < radius; x++) {
            const height = ~~(Math.sqrt(radius * radius - x * x));
            for (let y = -height; y < height; y++) {
                const lt = this.getRelativeTile(x, y, false);
                if (lt && lt.instanceOf(...tiles)) return true;
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
        this.updateLight();
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
            this._tile.onRender();
        }
        this.lightSprite.setBrightness(this.lightLevel / 20);
    }

    public getRelativeTile(x: number, y: number, generate = true): LevelTile | undefined {
        if (x === 0 && y === 0) return this;
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

    public destroy() {
        this.groundContainer.destroy({children: true});
        this.sortableContainer.destroy({children: true});
        this.lightSprite.destroy({children: true});
    }

    public setLight(value: number) {
        if (value > this.lightLevel) {
            this.lightLevel = value;
        }
    }

    public updateLight() {
        let lightLevel = this._tile?.light;
        if (!lightLevel || lightLevel === 0) return;
        this.lightLevel -= 1;
        if (this.lightLevel > lightLevel) lightLevel = this.lightLevel;
        const radius = Math.round(Math.sqrt(lightLevel * 2));
        for (let x = -radius; x < radius; x++) {
            for (let y = -radius; y < radius; y++) {
                const tile = this.getRelativeTile(x, y);
                if (!tile || !tile._tile) continue;
                const value = (lightLevel * (1 - Math.hypot(x, y) / radius));
                if (value > tile.lightLevel) {
                    tile.lightLevel = value;
                }
            }
        }
    }

    private sort() {
        if (!this._tile) return;
        this.sortableContainer.zIndex = this._y + 16 * this._tile.anchor;
    }
}
