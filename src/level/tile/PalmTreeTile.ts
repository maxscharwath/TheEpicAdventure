import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class PalmTreeTile extends TreeTile {

    protected initTree() {
        this.setGroundTile(Tiles.SAND.tile);
        this.treeTilingInit(System.getResource("palm.png"));
    }

    public static readonly TAG: string = "palm";

}
