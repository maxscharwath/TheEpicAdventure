import * as PIXI from "pixi.js";
import AutoTilingTile from "./AutoTilingTile";
import Tile from "./Tile";

export default class GrassTile extends AutoTilingTile {
    protected static autoTileTextures = GrassTile.loadMaskTextures("src/resources/grass_mask.png");
    protected init(): void {
            super.init();
            this.levelTile.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/grass.png")));
            this.initAutoTile();
    }
    public static readonly TAG = "grass";

    public tick(): void {
        super.tick();
    }

}
