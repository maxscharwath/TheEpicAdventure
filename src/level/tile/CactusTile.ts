import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity} from "../../entity";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class CactusTile extends Tile {
    private static tileTexture = PIXI.Texture.from(System.getResource("cactus.png"));
    public static readonly TAG = "dirt";

    public init() {
        super.init();
        this.groundTile = new (Tiles.SAND.tile)(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.container.addChild(new PIXI.Sprite(CactusTile.tileTexture));
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

    public bumpedInto(entity: Entity) {
    }
}
