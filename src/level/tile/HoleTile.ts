import System from "../../core/System";
import Updater from "../../core/Updater";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class HoleTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "water"];
    protected static autoTileTextures = HoleTile.loadMaskTextures(System.getResource("hole.png"));

    public static readonly TAG = "hole";

    public init() {
        super.init();
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();

        if (Updater.every(5)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.get("water")))) {
                this.levelTile.setTile(Tiles.get("water"));
            }
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.get("lava")))) {
                this.levelTile.setTile(Tiles.get("lava"));
            }
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
