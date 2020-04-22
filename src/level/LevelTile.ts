import * as PIXI from "pixi.js";
import Entity from "../entity/Entity";
import TileRandom from "../utility/TileRandom";
import Biome from "./biome/Biome";
import Chunk from "./Chunk";
import Level from "./Level";
import Tile from "./tile/Tile";
import Tiles from "./tile/Tiles";

type Type<T> = new (...args: any[]) => T;
export default class LevelTile extends PIXI.Container {
    private chunk: Chunk;
    private tileClass: Type<Tile>;
    public static SIZE = 16;
    public biome: Biome;
    public tile: Tile;
    public data: object = {};
    public updateRender: boolean = true;
    public level: Level;
    public random: TileRandom = new TileRandom(this);
    public readonly x: number;
    public readonly y: number;
    public bg: PIXI.Sprite;

    constructor(level: Level, x: number, y: number, biome?: Biome, tileClass?: Type<Tile>) {
        super();
        this.biome = biome;
        this.x = x << 4;
        this.y = y << 4;
        this.level = level;
        this.tileClass = tileClass;
        this.visible = false;
    }

    public init() {
        this.removeChildren();
        this.bg = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.bg.width = LevelTile.SIZE;
        this.bg.height = LevelTile.SIZE;
        this.bg.tint = this.biome.color.getInt();
        this.addChild(this.bg);
        if (!(this.tileClass.prototype instanceof Tile)) {
            throw new Error("Cannot initialize LevelTile: Wrong Tile");
        }
        this.tile = new this.tileClass(this);
        this.level.tilesContainer.addChild(this);
        this.addChild(this.tile.container);
    }

    public getLocalX() {
        return this.x >> 4;
    }

    public getLocalY() {
        return this.y >> 4;
    }

    public steppedOn(entity: Entity) {
        this.tile.steppedOn(entity);
    }

    public is(name: string) {
        return this.tile instanceof Tiles.get(name);
    }

    public setTile(tileClass: Type<Tile>, init: boolean = true) {
        this.tileClass = tileClass;
        if (init) {
            this.init();
        }
    }

    public findTileRadius(radius: number, ...tiles: Array<Type<Tile>>) {
        for (let x = -radius; x < radius; x++) {
            const height = ~~(Math.sqrt(radius * radius - x * x));
            for (let y = -height; y < height; y++) {
                if (this.getRelativeTile(x, y, false).instanceOf(...tiles)) {
                    return true;
                }
            }
        }
        return false;
    }

    public toJSON() {
        return {
            biome: this.biome.tag,
            x: this.x,
            y: this.y,
            tile: this.tile,
            data: this.data,
        };
    }

    public tick() {
        this.tile.tick();
    }

    public getRelativeTile(x: number, y: number, generate = true): LevelTile {
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
        return [
            this.getRelativeTile(-1, 0, generate),
            this.getRelativeTile(0, 1, generate),
            this.getRelativeTile(0, -1, generate),
            this.getRelativeTile(1, 0, generate),
        ];
    }

    public getTile(tile: string): number {
        let n = 0;
        if (this.getRelativeTile(0, -1).is(tile)) {
            n = n | (1 << 0);
        }// UP
        if (this.getRelativeTile(0, 1).is(tile)) {
            n = n | (1 << 1);
        }// DOWN
        if (this.getRelativeTile(-1, 0).is(tile)) {
            n = n | (1 << 2);
        }// LEFT
        if (this.getRelativeTile(1, 0).is(tile)) {
            n = n | (1 << 3);
        }// RIGHT
        return n;
    }

    public mayPass(entity: Entity) {
        return this.tile.mayPass(entity);
    }

    public getFriction() {
        return this.tile.friction;
    }

    public instanceOf(...tileClass: Array<Type<Tile>>) {
        return this.tile.instanceOf(...tileClass);
    }

}
