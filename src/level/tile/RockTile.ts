import * as PIXI from "pixi.js";
import System from "../../core/System";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";
import Tile from "./Tile";

export default class RockTile extends AutoTilingTile  {
    protected static autoTileTextures = RockTile.loadMaskTextures(System.getResource("rock.png"));
    public static readonly TAG = "rock";

    public init() {
        super.init();
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

}
