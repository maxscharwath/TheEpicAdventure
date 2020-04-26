import * as PIXI from "pixi.js";
import {Entity} from "../../entity";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class CactusTile extends Tile {
    private static tileTexture = PIXI.Texture.from("src/resources/cactus.png");
    public static readonly TAG = "dirt";

    public init() {
        super.init();
        this.groundTile = new (Tiles.get("sand"))(this.levelTile);
        this.container.addChild(this.groundTile.container);
        this.groundTile.init();
        this.container.addChild(new PIXI.Sprite(CactusTile.tileTexture));
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

}
