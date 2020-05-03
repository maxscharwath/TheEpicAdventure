import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class SpruceTreeTile extends TreeTile {
    protected initTree() {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "spruce.png"));
    }

    public static readonly TAG: string = "spruce";

    public onUpdate() {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.SNOW.tile))) {
            this.setGroundTile(Tiles.SNOW.tile);
        }
    }

    public onTick(): void {
        super.onTick();
    }
}
