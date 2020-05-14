import * as PIXI from "pixi.js";
import System from "../../core/System";
import Updater from "../../core/Updater";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class LilyPadTile extends Tile {
    public static readonly TAG = "lilypad";

    private static tileTextures = LilyPadTile.loadTextures(System.getResource("tile", "lilypad.png"), 4);
    private sprite?: PIXI.Sprite;

    public init() {
        super.init();
        this.groundTile = new (Tiles.WATER.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.sprite = new PIXI.Sprite(LilyPadTile.tileTextures[this.random.int(LilyPadTile.tileTextures.length)]);
        this.container.addChild(this.sprite);
    }

    public onTick(): void {
        super.onTick();
    }

    public onRender() {
        super.onRender();
        this.sprite?.pivot.set(0, Math.sin(Updater.tickCount / 2) / 4);
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.levelTile.setTile(Tiles.WATER);
        this.addItemEntity(Items.LILYPAD);
        return true;
    }
}
