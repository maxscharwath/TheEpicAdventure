import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class DirtTile extends Tile {
    public static readonly TAG = "dirt";
    public init() {
            super.init();
            this.container.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/dirt.png")));
    }

    public tick(): void {
        super.tick();
    }

}
