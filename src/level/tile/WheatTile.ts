import * as PIXI from "pixi.js";
import System from "../../core/System";
import Items from "../../item/Items";
import FarmlandTile from "./FarmlandTile";
import {Entity} from "../../entity";

export default class WheatTile extends FarmlandTile {
    public static readonly TAG: string = "wheat";

    private sprite?: PIXI.Sprite;
    private wiggleDelay: number = 0;

    public init() {
        super.init();
        const baseTexture = new PIXI.BaseTexture(System.getResource("tile", "wheat.png"));
        this.sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(8, 8);
        this.sortableContainer.addChild(this.sprite);
        this.anchor = 0.75;
    }

    public steppedOn(entity: Entity) {
        this.wiggleDelay = 5;
    }

    public onTick(): void {
        super.onTick();
        if (this.growthRate(100)) {
            if (this.states.age < 50) {
                this.states.age++;
            }
        }
        if (this.sprite?.texture.valid) {
            this.sprite.texture.frame = new PIXI.Rectangle(~~(this.states.age / 50 * 4) * 16, 0, 16, 16);
        }

        if (this.wiggleDelay > 0) {
            this.wiggleDelay--;
            this.sprite.scale.set(
                1 + Math.sin(this.wiggleDelay) / 10,
                1 + Math.cos(this.wiggleDelay) / 10,
            );
        } else {
            this.sprite.scale.set(1, 1);
        }
    }

    public onRender() {
        super.onRender();
    }

    protected harvest() {
        if (this.states.age >= 50) {
            this.addItemEntity(Items.WHEAT, 3);
        }
        this.addItemEntity(Items.SEED_WHEAT);
    }

}
