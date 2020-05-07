import System from "../../core/System";
import Updater from "../../core/Updater";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";
import WaterTile from "./WaterTile";

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

        if (Updater.every(10)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            {
                const t = n.find((l) =>
                    !l.skipTick && l.instanceOf(Tiles.WATER.tile) && (l.tile as WaterTile).states.level > 0);
                if (t) {
                    this.levelTile.setTile(Tiles.WATER, {level: (t.tile as WaterTile).states.level - 1});
                }
            }
            {
                const t = n.find((l) => !l.skipTick && l.instanceOf(Tiles.LAVA.tile))?.tile;
                if (t) {
                    this.levelTile.setTile(Tiles.LAVA);
                }
            }
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
