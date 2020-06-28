import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class DirtTile extends Tile {
    public static readonly TAG = "dirt";
    public static readonly COLOR: number = 0x94785c;
    private static tileTextures = DirtTile.loadTextures(System.getResource("tile", "dirt.png"), 4);
    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(DirtTile.tileTextures[this.random.int(DirtTile.tileTextures.length)]),
        );
    }

    public onTick(): void {
        super.onTick();
        if (this.levelTile.biome.is("grassland") && Random.probability(500)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.GRASS.tile))) {
                this.levelTile.setTile(Tiles.GRASS);
            }
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.SAND.tile))) {
                this.levelTile.setTile(Tiles.SAND);
            }
        }
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.hoe:
                    this.levelTile.setTile(Tiles.FARMLAND);
                    return true;
                case ToolType.shovel:
                    this.addItemEntity(Items.DIRT);
                    this.levelTile.setTile(Tiles.HOLE);
                    return true;
            }
        }
        return false;
    }

}
