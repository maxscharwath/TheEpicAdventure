import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, ItemEntity, Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ResourceItem from "../../item/ResourceItem";
import Resources from "../../item/resources/Resources";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class GrassTile extends AutoTilingTile {
    protected static autoTileTextures = GrassTile.loadMaskTextures(System.getResource("grass_mask.png"));
    private static tileTextures = GrassTile.loadTextures(System.getResource("grass.png"), 6);
    public static readonly TAG = "grass";

    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(GrassTile.tileTextures[this.random.int(GrassTile.tileTextures.length)]),
        );
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.hoe:
                    if (Random.probability(5)) {
                        this.level.addEntity(
                            new ItemEntity(Items.SEED_WHEAT.item,
                                this.x << 4 + Random.int(10) + 3,
                                this.y << 4 + Random.int(10) + 3),
                        );
                    }
                    this.levelTile.setTile(Tiles.FARMLAND.tile);
                    return true;
                case ToolType.shovel:
                    if (Random.probability(5)) {
                        this.level.addEntity(
                            new ItemEntity(Items.SEED_WHEAT.item,
                                this.x << 4 + Random.int(10) + 3,
                                this.y << 4 + Random.int(10) + 3),
                        );
                    }
                    this.levelTile.setTile(Tiles.DIRT.tile);
                    return true;
            }
        }
        return false;
    }

    public steppedOn(entity: Entity) {
        super.steppedOn(entity);
    }

}
