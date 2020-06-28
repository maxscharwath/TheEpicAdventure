import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class PalmTreeTile extends TreeTile {
    public static readonly TAG: string = "palm";
    public static readonly COLOR: number = 0x94785c;

    protected initTree() {
        this.setGroundTile(Tiles.SAND.tile);
        this.treeTilingInit(System.getResource("tile", "palm.png"));
    }

}
