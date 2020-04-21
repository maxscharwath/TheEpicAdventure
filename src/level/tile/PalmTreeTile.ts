import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class PalmTreeTile extends TreeTile {

    protected initTree() {
        this.groundTile = new (Tiles.get("grass"))(this.levelTile);
        this.treeTilingInit("src/resources/palm.png");
    }

    public tick(): void {
        super.tick();
    }
}
