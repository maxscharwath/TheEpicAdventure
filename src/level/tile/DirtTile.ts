import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class DirtTile extends Tile {
    private static tileTextures = DirtTile.loadTextures("src/resources/dirt.png", 4);
    public static readonly TAG = "dirt";
    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(DirtTile.tileTextures[this.random.int(DirtTile.tileTextures.length)]),
        );
    }

    public onTick(): void {
        super.onTick();
    }

}
