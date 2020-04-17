import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class SandTile extends Tile {
    public static readonly TAG = "sand";

    public tick(): void {

    }

    protected init(): void {
        const sprite = PIXI.Sprite.from("src/resources/sand.png");
        sprite.tint = this.levelTile.biome.color.getInt();
        this.levelTile.addChild(sprite);
    }

}
