import * as PIXI from "pixi.js";
import AutoTilingTile from "./AutoTilingTile";

export default class GrassTile extends AutoTilingTile {
    protected static autoTileTextures = GrassTile.loadMaskTextures("src/resources/grass_mask.png");
    public static readonly TAG = "grass";

    public init() {
            super.init();
            this.levelTile.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/grass.png")));
            this.initAutoTile();
    }

    public tick(): void {
        super.tick();
    }

}
