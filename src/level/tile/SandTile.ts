import * as PIXI from "pixi.js";
import AutoTilingTile from "./AutoTilingTile";
import Tile from "./Tile";

export default class SandTile extends AutoTilingTile  {
    protected static autoTileTextures = SandTile.loadMaskTextures("src/resources/sand_mask.png");
    protected init(): void {
        super.init();
        this.levelTile.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/sand.png")));
        this.initAutoTile();
    }
    public static readonly TAG = "sand";

    public tick(): void {
        super.tick();
    }

}
