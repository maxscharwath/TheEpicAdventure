import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Mob} from "../../entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import TileStates from "./TileStates";

export default class CactusTile extends Tile {
    protected states = TileStates.create({damage: 0});
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

    public bumpedInto(entity: Entity) {
        if (entity instanceof Mob) {
            entity.hurt(6);
        }
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.levelTile.setTile(this.groundTile.getClass());
        return true;
    }
}
