import * as PIXI from "pixi.js";
import System from "../../core/System";
import Items from "../../item/Items";
import FarmlandTile from "./FarmlandTile";

export default class PotatoTile extends FarmlandTile {
    public static readonly TAG: string = "potato";

    private sprite: PIXI.Sprite;

    public init() {
        super.init();
        const baseTexture = new PIXI.BaseTexture(System.getResource("tile", "potato.png"));
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.container.addChild(this.sprite);
    }

    public onTick(): void {
        super.onTick();
        if (this.growthRate(100)) {
            if (this.states.age < 50) {
                this.states.age++;
            }
        }
        if (this.sprite.texture.valid) {
            this.sprite.texture.frame = new PIXI.Rectangle(~~(this.states.age / 50 * 4) * 16, 0, 16, 16);
        }
    }

    public onRender() {
        super.onRender();
    }

    protected harvest() {
        if (this.states.age >= 50) {
            this.addItemEntity(Items.POTATO, 4);
        }
    }

}
