import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Entity, Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class SandTile extends AutoTilingTile {
    public static readonly TAG = "sand";
    public static readonly COLOR: number = 0xe0f878;
    protected static autoTileTextures = SandTile.loadMaskTextures(System.getResource("tile", "sand_mask.png"));
    private step: number = 0;
    private stepDir: boolean = false;
    private footprintSprite?: PIXI.Sprite;

    public steppedOn(entity: Entity) {
        if (this.step < 550 && entity instanceof Mob) {
            this.step = 600;
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

    protected onDestroy() {
        super.onDestroy();
        this.levelTile.setTile(Tiles.HOLE);
        this.addItemEntity(Items.SAND);
    }

    public onTick(): void {
        super.onTick();
        if (this.step > 0) {
            this.step--;
        }
        if (this.footprintSprite) {
            if (this.footprintSprite.texture.valid) {
                this.footprintSprite.texture.frame = new PIXI.Rectangle(this.stepDir ? 16 : 0, 0, 16, 16);
            }
            this.footprintSprite.visible = this.step > 0;
        }
    }

}
