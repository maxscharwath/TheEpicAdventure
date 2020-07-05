import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class StoneTile extends Tile {
    public static readonly TAG = "stone";
    public static readonly COLOR: number = 0x0cb516;

    private static tileTextures = StoneTile.loadTextures(System.getResource("tile", "stone.png"), 5);
    private sprite?: PIXI.Sprite;

    public init() {
        super.init();
        this.setGroundTile(Tiles.DIRT.tile);
        this.sprite = new PIXI.Sprite(StoneTile.tileTextures[this.random.int(StoneTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

    public onUpdate() {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        [Tiles.DIRT, Tiles.GRASS].forEach((tile) => {
            if (n.some((l) => !l.skipTick && l.instanceOf(tile.tile))) {
                this.setGroundTile(tile.tile);
            }
        });
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (this.groundTile) this.levelTile.setTile(this.groundTile.getClass());
        return true;
    }
}
