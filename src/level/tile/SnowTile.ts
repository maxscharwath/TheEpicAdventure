import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import AutoTilingTile from "./AutoTilingTile";

export default class SnowTile extends AutoTilingTile  {
    protected static autoTileTextures = SnowTile.loadMaskTextures(System.getResource("snow.png"));


    private step: number = 0;
    private stepDir: boolean = false;
    private footprintSprite: PIXI.Sprite;
    public static readonly TAG = "snow";
    public friction: number = 0.25;

    public steppedOn(entity: Entity) {
        if (this.step < 50 && entity instanceof Mob) {
            this.step = 100;
            this.stepDir = entity.getDir().isX();
        }
    }

    public init() {
        super.init();
        this.initAutoTile();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("snow_footprint.png"));
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

    public mayPass(): boolean {
        return true;
    }

}
