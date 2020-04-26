import * as PIXI from "pixi.js";
import {ItemEntity, Mob} from "../../entity";
import Item from "../../item/Item";
import ResourceItem from "../../item/ResourceItem";
import Resources from "../../item/resources/Resources";
import FarmlandTile from "./FarmlandTile";
import Tiles from "./Tiles";

export default class WheatTile extends FarmlandTile {

    protected harvest() {
        if (this.age >= 50) {
            this.level.add(new ItemEntity(new ResourceItem(Resources.wheat)), this.x, this.y, true);
            this.level.add(new ItemEntity(new ResourceItem(Resources.seedWheat)), this.x, this.y, true);
        } else {
            this.level.add(new ItemEntity(new ResourceItem(Resources.seedWheat)), this.x, this.y, true);
        }
    }

    private sprite: PIXI.Sprite;
    private age: number = 0;
    public static readonly TAG: string = "wheat";

    public init() {
        super.init();
        const baseTexture = new PIXI.BaseTexture("src/resources/wheat.png");
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.container.addChild(this.sprite);
    }


    public onInteract(mob: Mob, item?: Item) {
        this.harvest();
        this.levelTile.setTile(Tiles.get("farmland"));
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
