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
    public static SIZE = 16;
    public biome: Biome;
    public tile: Tile;
    public data: object = {};
    public updateRender: boolean = true;
    public level: Level;
    public random: TileRandom = new TileRandom(this);
    public readonly x: number;
    public readonly y: number;
    private chunk: Chunk;

    constructor(level: Level, x: number, y: number, biome?: Biome, tile?: Type<Tile>) {
        super();
        this.biome = biome;
        this.x = x << 4;
        this.y = y << 4;
        this.level = level;
        {
            this.visible = false;
            const bg = new PIXI.Sprite(PIXI.Texture.WHITE);
            bg.tint = this.biome.color.getInt();
            bg.width = LevelTile.SIZE;
            bg.height = LevelTile.SIZE;
            this.addChild(bg);
            this.level.tilesContainer.addChild(this);
        }
        this.tile = new tile(this);
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

    public setTile(tile: Type<Tile>) {
        this.removeChildren();
        this.tile = new tile(this);

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

    public getRelativeTile(x: number, y: number): LevelTile {
        return this.level.getTile(this.x + x, this.y + y);
    }

    public getNeighbourTiles(radius: number = 1): LevelTile[] {
        const lt = [];
        for (let i = this.x - radius; i < this.x + radius; i++) {
            for (let j = this.y - radius; j < this.y + radius; j++) {
                if (i === this.x && j === this.y) {
                    continue;
                }
                lt.push(this.level.getTile(i, j));
            }
        }
        return lt;
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
}
