import * as PIXI from "pixi.js";
import System from "../../core/System";
import Entity from "../../entity/Entity";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class LavaTile extends AutoTilingTile {
    protected static canConnectTo = ["hole", "water"];
    protected static autoTileTextures = LavaTile.loadMaskTextures(System.getResource("tile", "lava_mask.png"));
    private static tileTextures = LavaTile.loadTextures(System.getResource("tile", "lava.png"), 6);
    private animSprite: PIXI.AnimatedSprite;
    public static readonly TAG = "lava";

    public init() {
        super.init();
        this.animSprite = new PIXI.AnimatedSprite(LavaTile.tileTextures);
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
    }

    public onUpdate() {
        super.onUpdate();
        if (this.levelTile.getDirectNeighbourTiles(false).some((l) => l.instanceOf(Tiles.WATER.tile))) {
            this.levelTile.setTile(Tiles.ROCK.tile);
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
