import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class SpruceTreeTile extends TreeTile {
    protected initTree() {
        this.setGroundTile(Tiles.get("grass"));
        this.treeTilingInit(System.getResource("spruce.png"));
    }

    public static readonly TAG: string = "spruce";

    public onUpdate() {
        super.onUpdate();
        const n = this.levelTile.getDirectNeighbourTiles(false);
        if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.get("snow")))) {
            this.setGroundTile(Tiles.get("snow"));
        }
    }

    public onTick(): void {
        super.onTick();
    }
}
