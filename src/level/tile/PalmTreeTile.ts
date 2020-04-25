import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class PalmTreeTile extends TreeTile {

    protected initTree() {
        this.groundTile = new (Tiles.get("sand"))(this.levelTile);
        this.treeTilingInit("src/resources/palm.png");
    }

    public static readonly TAG: string = "palm";

}
