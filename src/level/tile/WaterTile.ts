import * as PIXI from "pixi.js";
import {Entity, Fish} from "../../entity/";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";

export default class WaterTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "hole"];
    protected static autoTileTextures = WaterTile.loadMaskTextures("src/resources/water_mask.png");
    private static tileTextures = WaterTile.loadTextures("src/resources/water.png", 10);
    private animSprite: PIXI.AnimatedSprite;
    public static readonly TAG = "water";

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

    public onTick(): void {
        super.onTick();
        if (!this.animSprite.playing && Random.probability(1000)) {
            this.animSprite.gotoAndPlay(1);
        }
        if (Random.probability(100000)) {
            this.levelTile.level.add(new Fish(), this.levelTile.getLocalX(), this.levelTile.getLocalY(), true);
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }


}
