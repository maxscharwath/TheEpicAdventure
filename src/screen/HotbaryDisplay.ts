import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import {Mob} from "../entity";
import Item from "../item/Item";
import Slot from "../item/Slot";
import Display from "./Display";

class InventorySlot extends PIXI.Container {
    private slot: Slot;
    private item?: Item;

    private itemSprite: PIXI.Sprite;

    constructor(slot: Slot) {
        super();
        this.slot = slot;
        this.buttonMode = true;
        this.interactive = true;
        this.on("click", (ev: any) => {
            if (this.slot.isItem()) {
                console.log(this.slot.item.getDisplayName());
            }
        });
        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
        sprite.width = 8;
        sprite.height = 8;
        sprite.alpha = 0.5;

        this.addChild(sprite);
    }

    public update() {
        if (this.item === this.slot.item) {
            return;
        }
        this.item = this.slot.item;
        this.removeChild(this.itemSprite);
        if (this.slot.isItem()) {
            this.itemSprite = this.slot.item.getSprite();
            this.addChild(this.itemSprite);
        }
    }
}

export default class HotbarDisplay extends Display {
    private mob: Mob;
    private slots: InventorySlot[] = [];

    private init() {
        const nbRow = 9;
        for (let i = 0; i < nbRow; i++) {
            const slot = this.mob.inventory.slots[i];
            const x = (i % nbRow) * 10;
            const slotSprite = new InventorySlot(slot);
            slotSprite.position.set(x, 0);
            this.slots.push(slotSprite);
            this.addChild(slotSprite);
        }
    }

    constructor(mob: Mob) {
        super(false);
        this.mob = mob;
        this.init();
        this.scale.set(4);

        this.position.x = (Renderer.getScreen().width - this.width) / 2;
        this.position.y = Renderer.getScreen().height - this.height - 20;
    }

    public onTick(): void {
        super.onTick();
        this.slots.forEach((slot) => slot.update());
    }
}
