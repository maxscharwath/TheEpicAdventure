import * as PIXI from "pixi.js";
import System from "../../core/System";
import Items from "../../item/Items";
import CropTile from "./CropTile";

export default class CornTile extends CropTile {
    public static readonly COLOR: number = 0x94785c;
    public static readonly TAG: string = "corn";

    protected harvest() {
        if (this.states.age >= 50) {
            this.addItemEntity(Items.CORN, [1, 3]);
        } else {
            this.addItemEntity(Items.CORN, 1);
        }
    }

    protected initCrop() {
        super.initCrop();
        const baseTexture = new PIXI.BaseTexture(System.getResource("tile", "corn.png"));
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(8, 8);
        this.sortableContainer.addChild(this.sprite);
        this.anchor = 0.75;
    }

}
