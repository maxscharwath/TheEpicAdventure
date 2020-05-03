import System from "../../core/System";
import Updater from "../../core/Updater";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class HoleTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "water"];
    protected static autoTileTextures = HoleTile.loadMaskTextures(System.getResource("tile", "hole.png"));

    public static readonly TAG = "hole";

    public init() {
        super.init();
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();

        if (Updater.every(5)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.WATER.tile))) {
                this.levelTile.setTile(Tiles.WATER.tile);
            }
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.LAVA.tile))) {
                this.levelTile.setTile(Tiles.LAVA.tile);
            }
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
