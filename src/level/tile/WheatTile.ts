import * as PIXI from "pixi.js";
import System from "../../core/System";
import Items from "../../item/Items";
import FarmlandTile from "./FarmlandTile";

export default class WheatTile extends FarmlandTile {

    protected harvest() {
        if (this.age >= 50) {
            this.addItemEntity(Items.WHEAT, 3);
        }
        this.addItemEntity(Items.SEED_WHEAT);
    }

    private sprite: PIXI.Sprite;
    public static readonly TAG: string = "wheat";

    public init() {
        super.init();
        const baseTexture = new PIXI.BaseTexture(System.getResource("tile", "wheat.png"));
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.container.addChild(this.sprite);
    }

    public onTick(): void {
        super.onTick();
        if (this.growthRate(100)) {
            if (this.age < 50) {
                this.age++;
            }
        }
        if (this.sprite.texture.valid) {
            this.sprite.texture.frame = new PIXI.Rectangle(~~(this.age / 50 * 4) * 16, 0, 16, 16);
        }
    }

    public onRender() {
        super.onRender();
    }

}
