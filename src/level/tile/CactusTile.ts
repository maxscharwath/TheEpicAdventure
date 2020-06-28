import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Mob} from "../../entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import TileStates from "./TileStates";
import Items from "../../item/Items";
import HurtParticle from "../../entity/particle/HurtParticle";

export default class CactusTile extends Tile {
    public static readonly TAG = "cactus";
    public static DEFAULT_STATES = {damage: 0};
    public static readonly COLOR: number = 0x2a963c;
    private static tileTexture = PIXI.Texture.from(System.getResource("tile", "cactus.png"));
    public states = TileStates.create(CactusTile.DEFAULT_STATES);

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
            entity.hurt(1);
        }
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (this.groundTile) this.levelTile.setTile(this.groundTile.getClass());
        this.levelTile.level.add(new HurtParticle(this.levelTile.x + 8, this.levelTile.y + 8));
        this.addItemEntity(Items.CACTUS_FLOWER);
        return true;
    }
}
