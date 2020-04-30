import * as PIXI from "pixi.js";
import System from "../../core/System";
import AutoTilingTile from "./AutoTilingTile";

export default class IceTile extends AutoTilingTile {
    protected static canConnectTo = ["hole"];
    protected static autoTileTextures = IceTile.loadMaskTextures(System.getResource("water_mask.png"));
    public static readonly TAG = "ice";
    public friction = 0.01;

    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(PIXI.Texture.from(System.getResource("ice.png"))),
        );
        this.initAutoTile();
    }
}
