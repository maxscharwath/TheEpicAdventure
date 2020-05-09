import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import System from "../core/System";
import {Mob} from "../entity";
import Item from "../item/Item";
import Slot from "../item/Slot";
import Color from "../utility/Color";
import Display from "./Display";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";

class InventorySlot extends PIXI.Container {
    public index: number = 0;
    public slot: Slot;
    public item?: Item;

    private itemSprite: PIXI.Sprite;
    private itemContainer = new PIXI.Container();

    constructor(slot: Slot, index: number = 0) {
        super();
        this.index = index;
        this.slot = slot;
        this.buttonMode = true;
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(4, 4, 10, 10);
        const baseTexture = PIXI.BaseTexture.from(System.getResource("gui", "gui_hotbar.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        sprite.width = 16;
        sprite.height = 16;
        this.itemContainer.position.set(4, 4);
        this.itemContainer.width = 8;
        this.itemContainer.height = 8;
        this.addChild(sprite, this.itemContainer);
    }

    public update() {
        if (this.item === this.slot.item) {
            return;
        }
        this.item = this.slot.item;
        this.itemContainer.removeChildren();
        if (this.slot.isItem()) {
            this.itemSprite = this.slot.item.getSprite();
            this.itemContainer.addChild(this.itemSprite);
        }
    }
}

export default class HotbarDisplay extends Display {
    private mob: Mob;
    private slots: InventorySlot[] = [];
    private selectSprite: PIXI.Sprite;
    private itemText: PIXI.BitmapText;

    constructor(mob: Mob) {
        super(false);
        this.mob = mob;
        this.init();
        this.position.x = (Renderer.getScreen().width - this.width) >> 1;
        this.position.y = Renderer.getScreen().height - this.height - 20;
    }

    public onTick(): void {
        super.onTick();
        this.slots.forEach((slot) => slot.update());
    }

    public onRender() {
        super.onRender();
        this.setCurrentSlot();
    }

    private init() {
        const baseTexture = PIXI.BaseTexture.from(System.getResource("gui", "gui_hotbar.png"));
        this.selectSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(16, 0, 16, 16)));
        this.itemText = new PIXI.BitmapText("", {
            font: {
                name: "Minecraftia",
                size: 16,
            },
            tint: Color.white.getInt(),
        });
        this.itemText.filters = [new DropShadowFilter({blur: 0, distance: 1, rotation: 90, quality: 0})];
        this.itemText.anchor = 0.5;
        const bar = new PIXI.Container();
        const nbRow = 10;
        for (let i = nbRow - 1; i >= 0; i--) {
            const slot = this.mob.inventory.slots[i];
            const x = (i % nbRow) * 10;
            const slotSprite = new InventorySlot(slot, i);
            slotSprite.on("click", () => {
                this.mob.inventory.selectedSlot = slotSprite.index;
            });
            slotSprite.position.set(x, 0);
            this.slots.push(slotSprite);
            bar.addChild(slotSprite);
        }
        bar.addChild(this.selectSprite);
        bar.scale.set(4);
        this.addChild(bar, this.itemText);
        this.itemText.position.set(this.width / 2, -10);
    }

    private setCurrentSlot() {
        const index = this.mob.inventory.selectedSlot;
        const slot = this.mob.inventory.getSlot(index);
        if (slot.isItem()) {
            this.itemText.text = `${slot.item.getDisplayName()} - ${slot.nb}`;
        }
        if (this.selectSprite.x !== index * 10) {
            this.selectSprite.x -= (this.selectSprite.x - (index * 10)) / 2;
        }
    }
}
