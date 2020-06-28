import System from "../../core/System";
import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class BirchTreeTile extends TreeTile {
    public static readonly TAG: string = "birch";
    public static readonly COLOR: number = 0x20842a;

    protected initTree() {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "birch.png"));
    }
}
