import * as PIXI from "pixi.js";
import Tile from "./Tile";
import SpriteSheet from "../../gfx/SpriteSheet";
import System from "../../core/System";
import {Entity, Mob} from "../../entity";
import TileStates from "./TileStates";
import Tiles from "./Tiles";
import Item from "../../item/Item";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Items from "../../item/Items";
import FenceGateTile from "./FenceGateTile";

export default class FenceTile extends Tile {
    public static DEFAULT_STATES = {groundTile: 0};
    public static readonly TAG = "fence";
    protected static textures = SpriteSheet.loadTextures(System.getResource("tile", "fence.png"), 16, 16);
    public anchor = 0.75;

    public states = TileStates.create(FenceTile.DEFAULT_STATES);
    private sprite: PIXI.Sprite;

    public mayPass(e: Entity): boolean {
        return false;
    }

    public init() {
        super.init();
        this.sprite = new PIXI.Sprite(FenceTile.textures[0]);
        this.sprite.y = -4;
        this.sortableContainer.addChild(this.sprite);
        this.setGroundTile(Tiles.get(this.states.groundTile));
    }

    public onSetTile(oldTile: Tile, entity?: Entity) {
        this.setGroundTile(oldTile);
    }

    public setGroundTile(tile: typeof Tile | Tile): Tile | undefined {
        const t = super.setGroundTile(tile);
        if (!t) return undefined;
        this.states.groundTile = t.getKeys().idx;
        return t;
    }

    public onUpdate() {
        super.onUpdate();
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return t && t.instanceOf(FenceTile, FenceGateTile);
        };
        const N = test(0, -1) ? 1 : 0;
        const S = test(0, 1) ? 1 : 0;
        const W = test(-1, 0) ? 1 : 0;
        const E = test(1, 0) ? 1 : 0;
        const id = (((N << 1) + W << 1) + E << 1) + S;
        this.sprite.texture = FenceTile.textures[id];
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.axe:
                    this.onDestroy();
                    return true;
            }
        }
        return false;
    }

    protected onDestroy() {
        super.onDestroy();
        this.setTileToGround();
        this.addItemEntity(Items.FENCE);
    }

}
