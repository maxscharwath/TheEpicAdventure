import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class GrassTile extends Tile {
    public static readonly TAG = "grass";

    public tick(): void {

    }

    protected init(): void {
        const sprite = PIXI.Sprite.from("src/resources/grass.png");
        sprite.tint = this.levelTile.biome.color.getInt();
        this.levelTile.addChild(sprite);
    }

}
