import * as PIXI from "pixi.js";
import {Entity} from "../../entity";
import AutoTilingTile from "./AutoTilingTile";

export default class GrassTile extends AutoTilingTile {
    protected static autoTileTextures = GrassTile.loadMaskTextures("src/resources/grass_mask.png");
    private static tileTextures = GrassTile.loadTextures("src/resources/grass.png", 6);
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
