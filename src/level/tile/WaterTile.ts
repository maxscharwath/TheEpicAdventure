import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";

export default class WaterTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "hole"];
    protected static autoTileTextures = WaterTile.loadMaskTextures("src/resources/water.png");
    public static readonly TAG = "water";

    public init() {
        super.init();
        this.initAutoTile();
    }

    public tick(): void {
        super.tick();
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
