import * as PIXI from "pixi.js";
import AutoTilingTile from "./AutoTilingTile";
import Tile from "./Tile";

export default class SandTile extends AutoTilingTile  {
    protected static autoTileTextures = SandTile.loadMaskTextures("src/resources/sand_mask.png");
    public static readonly TAG = "sand";

    public init() {
        super.init();
        this.container.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/sand.png")));
        this.initAutoTile();
    }

    public tick(): void {
        super.tick();
    }

}
