import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";

export default class WaterTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "hole"];
    protected static autoTileTextures = WaterTile.loadMaskTextures("src/resources/water.png");
    protected init(): void {
        super.init();
        this.initAutoTile();
    }
    public static readonly TAG = "water";

    public tick(): void {
        super.tick();
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
