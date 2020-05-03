import * as PIXI from "pixi.js";
import System from "../../core/System";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class CactusTile extends Tile {
    private static tileTexture = PIXI.Texture.from(System.getResource("tile", "cactus.png"));
    public static readonly TAG = "dirt";

    public init() {
        super.init();
        this.groundTile = new (Tiles.SAND.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.container.addChild(new PIXI.Sprite(CactusTile.tileTexture));
    }

    public mayPass(): boolean {
        return false;
    }
}
