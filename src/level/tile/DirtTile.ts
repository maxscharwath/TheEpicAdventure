import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class GrassTile extends Tile {
    protected init(): void {
            super.init();
            this.levelTile.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/dirt.png")));
    }
    public static readonly TAG = "dirt";

    public tick(): void {
        super.tick();
    }

}
