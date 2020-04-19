import * as PIXI from "pixi.js";
import Inventory from "../item/Inventory";
import Item from "../item/Item";
import Slot from "../item/Slot";
import BackgroundDisplay from "./BackgroundDisplay";

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
        if (this.item === this.slot.item) {return; }
        console.log("update");
        this.item = this.slot.item;
        this.removeChild(this.itemSprite);
        if (this.slot.isItem()) {
            this.itemSprite = this.slot.item.getSprite();
            this.addChild(this.itemSprite);
        }
    }
}

export default class InventoryDisplay extends BackgroundDisplay {
    private inventory: Inventory;
    private slots: InventorySlot[] = [];
    private init() {
        const nbRow = 9;
        for (let i = 0; i < this.inventory.slots.length; i++) {
            const slot = this.inventory.slots[i];
            const x = (i % nbRow) * 10;
            const y =  ~~(i / nbRow) * 10;
            const slotSprite  = new InventorySlot(slot);
            slotSprite.position.set(x, y);
            this.slots.push(slotSprite);
            this.addChild(slotSprite);
        }
    }

    constructor(inventory: Inventory) {
        super(true);
        this.inventory = inventory;
        this.init();
        this.scale.set(4);
        const b = this.getBounds();
        this.width = b.width + b.x;
        this.height = b.height + b.y;
    }
    public tick(): void {
        super.tick();
        this.slots.forEach((slot) => slot.update());
    }
}
