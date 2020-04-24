import * as PIXI from "pixi.js";
import Updater from "../../core/Updater";
import Entity from "../../entity/Entity";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class LilyPadTile extends Tile {

    private static tileTextures = LilyPadTile.loadTextures("src/resources/lilypad.png", 4);
    private sprite: PIXI.Sprite;
    public static readonly TAG = "lilypad";

    public init() {
        super.init();
        this.groundTile = new (Tiles.get("water"))(this.levelTile);
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
        this.sprite.pivot.set(0, Math.sin(Updater.tickCount / 2) / 4);
    }

    public mayPass(e: Entity): boolean {
        return true;
    }
}
