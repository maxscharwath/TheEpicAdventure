import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity} from "../../entity";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class GrassTile extends AutoTilingTile {
    protected static autoTileTextures = GrassTile.loadMaskTextures(System.getResource("grass_mask.png"));
    private static tileTextures = GrassTile.loadTextures(System.getResource("grass.png"), 6);
    public static readonly TAG = "grass";

    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(GrassTile.tileTextures[this.random.int(GrassTile.tileTextures.length)]),
        );
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();
    }

    public steppedOn(entity: Entity) {
        super.steppedOn(entity);
    }

}
