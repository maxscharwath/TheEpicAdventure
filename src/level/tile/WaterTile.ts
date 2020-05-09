import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Fish} from "../../entity/";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import TileStates from "./TileStates";

export default class WaterTile extends AutoTilingTile {
    public static DEFAULT_STATES = {level: 10};
    public static readonly TAG = "water";
    protected static canConnectTo = ["lava", "hole", "ice"];
    protected static autoTileTextures = WaterTile.loadMaskTextures(System.getResource("tile", "water_mask.png"));
    protected static tileTextures = WaterTile.loadTextures(System.getResource("tile", "water.png"), 10);
    public states = TileStates.create(WaterTile.DEFAULT_STATES);
    public friction: number = 0.01;
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

    public onTick(): void {
        super.onTick();
        if (!this.animSprite.playing && Random.probability(1000)) {
            this.animSprite.gotoAndPlay(1);
        }
        if (Random.probability(100000)) {
            this.levelTile.level.addEntity(new Fish(), this.levelTile.getLocalX(), this.levelTile.getLocalY(), true);
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }


}
