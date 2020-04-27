import * as PIXI from "pixi.js";
import {Entity, Mob} from "../../entity";
import AutoTilingTile from "./AutoTilingTile";

export default class SandTile extends AutoTilingTile {
    protected static autoTileTextures = SandTile.loadMaskTextures("src/resources/sand_mask.png");
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

    public init() {
        super.init();
        const baseTexture = PIXI.BaseTexture.from("src/resources/sand_footprint.png");
        this.footprintSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.footprintSprite.visible = false;
        this.container.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/sand.png")), this.footprintSprite);
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
