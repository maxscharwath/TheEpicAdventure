import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class AcaciaTreeTile extends TreeTile {

    public static readonly TAG: string = "acacia";

    protected initTree() {
        this.setGroundTile(Tiles.DIRT.tile);
        this.treeTilingInit(System.getResource("tile", "acacia.png"));
        if (this.random.boolean()) {
            this.container.scale.x = -1;
            this.container.pivot.x = -this.container.width;
        }
    }
}
