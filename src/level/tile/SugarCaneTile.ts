import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class SugarCaneTile extends Tile {
    public static readonly COLOR: number = 0x0cb516;
    public static readonly TAG = "sugar_cane";

    private static tileTextures = SugarCaneTile.loadTextures(System.getResource("tile", "sugar_cane.png"), 4);
    private sprite?: PIXI.Sprite;

    public init(): void {
        super.init();
        this.groundTile = new (Tiles.WATER.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.sprite = new PIXI.Sprite(SugarCaneTile.tileTextures[this.random.int(SugarCaneTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.onDestroy();
        return true;
    }

    protected onDestroy(): void {
        super.onDestroy();
        this.setTile(Tiles.WATER);
    }
}
