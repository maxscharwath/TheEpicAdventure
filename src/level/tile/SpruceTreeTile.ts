import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class SpruceTreeTile extends TreeTile {
    protected initTree() {
        this.groundTile = new (Tiles.get("grass"))(this.levelTile);
        this.treeTilingInit("src/resources/spruce.png");
    }

    public onTick(): void {
        super.onTick();
    }
}
