import * as PIXI from "pixi.js";
import Entity from "../../entity/Entity";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";

export default class WaterTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "hole"];
    protected static autoTileTextures = WaterTile.loadMaskTextures("src/resources/water_mask.png");
    private static tileTextures = WaterTile.loadTextures("src/resources/water.png", 10);
    public static readonly TAG = "water";
    private animSprite: PIXI.AnimatedSprite;

    public init() {
        super.init();
        this.animSprite = new PIXI.AnimatedSprite(WaterTile.tileTextures);
        this.animSprite.loop = false;
        this.animSprite.animationSpeed = 0.1;
        this.container.addChild(
            this.animSprite,
        );
        this.initAutoTile();
    }

    public tick(): void {
        super.tick();
        if (!this.animSprite.playing && Random.probability(0.0001)) {
            this.animSprite.gotoAndPlay(1);
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
