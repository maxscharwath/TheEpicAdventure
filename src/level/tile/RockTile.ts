import System from "../../core/System";
import AutoTilingTile from "./AutoTilingTile";

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

    public mayPass(): boolean {
        return false;
    }

}
