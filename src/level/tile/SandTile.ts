import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, ItemEntity, Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class SandTile extends AutoTilingTile {
    protected static autoTileTextures = SandTile.loadMaskTextures(System.getResource("tile", "sand_mask.png"));
    private step: number = 0;
    private stepDir: boolean = false;
    private footprintSprite: PIXI.Sprite;
    public static readonly TAG = "sand";

    public steppedOn(entity: Entity) {
        if (this.step < 50 && entity instanceof Mob) {
            this.step = 100;
            this.stepDir = entity.getDir().isX();
        }
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.shovel:
                    this.addItemEntity(Items.SAND);
                    this.levelTile.setTile(Tiles.DIRT);
                    return true;
            }
        }
        return false;
    }

    public init() {
        super.init();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("tile", "sand_footprint.png"));
        this.footprintSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.footprintSprite.visible = false;
        this.container.addChild(
            new PIXI.Sprite(PIXI.Texture.from(System.getResource("tile", "sand.png"))), this.footprintSprite,
        );
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();
        if (this.step > 0) {
            this.step--;
        }
        if (this.footprintSprite.texture.valid) {
            this.footprintSprite.texture.frame = new PIXI.Rectangle(this.stepDir ? 16 : 0, 0, 16, 16);
        }
        this.footprintSprite.visible = this.step > 0;
    }

}
