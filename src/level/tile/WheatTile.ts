import * as PIXI from "pixi.js";
import System from "../../core/System";
import {ItemEntity, Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import FarmlandTile from "./FarmlandTile";
import Tiles from "./Tiles";

export default class WheatTile extends FarmlandTile {

    protected harvest() {
        if (this.age >= 50) {
            this.level.addEntity(new ItemEntity(Items.WHEAT.item), this.x, this.y, true);
            this.level.addEntity(new ItemEntity(Items.SEED_WHEAT.item), this.x, this.y, true);
        } else {
            this.level.addEntity(new ItemEntity(Items.SEED_WHEAT.item), this.x, this.y, true);
        }
    }

    private sprite: PIXI.Sprite;
    private age: number = 0;
    public static readonly TAG: string = "wheat";

    public init() {
        super.init();
        const baseTexture = new PIXI.BaseTexture(System.getResource("wheat.png"));
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.container.addChild(this.sprite);
    }


    public onInteract(mob: Mob, item?: Item) {
        this.harvest();
        this.levelTile.setTile(Tiles.FARMLAND.tile);
        return true;
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
