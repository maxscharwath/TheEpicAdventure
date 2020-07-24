import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Tile from "./Tile";
import Tiles from "./Tiles";
import Renderer from "../../core/Renderer";

export default class LilyPadTile extends Tile {
    public static readonly TAG = "lilypad";
    public static readonly COLOR: number = 0x0cb516;

    private static tileTextures = LilyPadTile.loadTextures(System.getResource("tile", "lilypad.png"), 4);
    private sprite?: PIXI.Sprite;

    public init() {
        super.init();
        this.groundTile = new (Tiles.WATER.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.sprite = new PIXI.Sprite(LilyPadTile.tileTextures[this.random.int(LilyPadTile.tileTextures.length)]);
        this.sortableContainer.addChild(this.sprite);
    }

    public onTick(): void {
        super.onTick();
    }

    public onRender() {
        super.onRender();
        this.sprite?.pivot.set(0, Math.sin(Renderer.ticks / 6) / 4);
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    protected onDestroy() {
        super.onDestroy();
        this.levelTile.setTile(Tiles.WATER);
        this.addItemEntity(Items.LILYPAD);
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.onDestroy();
        return true;
    }
}
