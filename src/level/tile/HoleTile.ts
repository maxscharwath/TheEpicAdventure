import Entity from "../../entity/Entity";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import LavaTile from "./LavaTile";
import Tiles from "./Tiles";
import WaterTile from "./WaterTile";

export default class HoleTile extends AutoTilingTile {
    protected static canConnectTo = ["lava", "water"];
    protected static autoTileTextures = HoleTile.loadMaskTextures("src/resources/hole.png");
    protected init(): void {
        super.init();
        this.initAutoTile();
    }
    public static readonly TAG = "hole";

    public tick(): void {
        super.tick();

        if (Random.probability(0.05)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => l.instanceOf(Tiles.get("water")))) {
                this.levelTile.setTile(Tiles.get("water"));
            }
            if (n.some((l) => l.instanceOf(Tiles.get("lava")))) {
                this.levelTile.setTile(Tiles.get("lava"));
            }
        }
    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

}
