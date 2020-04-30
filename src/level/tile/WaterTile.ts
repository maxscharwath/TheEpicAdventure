import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Fish} from "../../entity/";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";

export default class WaterTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "hole", "ice"];
    protected static autoTileTextures = WaterTile.loadMaskTextures(System.getResource("water_mask.png"));
    protected static tileTextures = WaterTile.loadTextures(System.getResource("water.png"), 10);
    private animSprite: PIXI.AnimatedSprite;
    public static readonly TAG = "water";
    public friction: number = 0.01;

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
