import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";

export default class LavaTile extends AutoTilingTile {
    protected static canConnectTo = ["hole", "water"];
    protected static autoTileTextures = LavaTile.loadMaskTextures("src/resources/lava.png");
    public static readonly TAG = "lava";

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
