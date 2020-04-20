import Tiles from "./Tiles";
import TreeTile from "./TreeTile";

export default class SpruceTreeTile extends TreeTile {
    public init() {
        super.init();
        this.groundTile = new (Tiles.get("grass"))(this.levelTile);
        this.groundTile.init();
        this.treeTilingInit("src/resources/spruce.png");
    }

    public tick(): void {
        super.tick();
    }
}
