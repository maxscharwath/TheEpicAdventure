import * as PIXI from "pixi.js";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";
import Tile from "./Tile";

export default class RockTile extends AutoTilingTile  {
    protected static autoTileTextures = RockTile.loadMaskTextures("src/resources/rock.png");
    protected init(): void {
        super.init();
        this.initAutoTile();
    }
    public static readonly TAG = "rock";

    public tick(): void {
        super.tick();
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

}
