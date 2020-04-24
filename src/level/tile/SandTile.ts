import * as PIXI from "pixi.js";
import {Entity, Mob} from "../../entity";
import AutoTilingTile from "./AutoTilingTile";

export default class SandTile extends AutoTilingTile {
    protected static autoTileTextures = SandTile.loadMaskTextures("src/resources/sand_mask.png");
    private step: number = 0;
    private footprintSprite: PIXI.Sprite;
    public static readonly TAG = "sand";

    public steppedOn(entity: Entity) {
        if (entity instanceof Mob) {
            this.step = 50;
        }
    }

    public init() {
        super.init();
        this.footprintSprite = new PIXI.Sprite(PIXI.Texture.from("src/resources/sand_footprint.png"));
        this.footprintSprite.visible = false;
        this.container.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/sand.png")), this.footprintSprite);
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();
        if (this.step > 0) {
            this.step--;
        }
        this.footprintSprite.visible = this.step > 0;
    }

}
