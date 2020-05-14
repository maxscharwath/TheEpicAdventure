import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class SnowTile extends AutoTilingTile  {
    public static readonly TAG = "snow";
    protected static autoTileTextures = SnowTile.loadMaskTextures(System.getResource("tile", "snow.png"));
    public friction: number = 0.25;


    private step: number = 0;
    private stepDir: boolean = false;
    private footprintSprite?: PIXI.Sprite;

    public steppedOn(entity: Entity) {
        if (this.step < 50 && entity instanceof Mob) {
            this.step = 100;
            this.stepDir = entity.getDir().isX();
        }
    }

    public init() {
        super.init();
        this.initAutoTile();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("tile", "snow_footprint.png"));
        this.footprintSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.footprintSprite.visible = false;
        this.container.addChild(this.footprintSprite);
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

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.shovel:
                    this.addItemEntity(Items.SNOWBALL, 3);
                    this.levelTile.setTile(Tiles.DIRT);
                    return true;
            }
        }
        return false;
    }

    public mayPass(): boolean {
        return true;
    }

}
