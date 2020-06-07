import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import System from "../core/System";
import {Mob, ItemEntity} from "../entity";
import Item from "../item/Item";
import Slot from "../item/Slot";
import Color from "../utility/Color";
import Display from "./Display";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";
import Game from "../core/Game";
import CraftingDisplay from "./CraftingDisplay";
import Crafting from "../crafting/Crafting";
import MapDisplay from "./MapDisplay";

class InventorySlot extends PIXI.Container {
    public index: number = 0;
    public slot: Slot;
    public item?: Item;

    private itemSprite?: PIXI.Sprite;
    private itemContainer = new PIXI.Container();

    constructor(slot: Slot, index: number = 0) {
        super();
        this.index = index;
        this.slot = slot;
        this.buttonMode = true;
        this.interactive = true;
        this.hitArea = new PIXI.Rectangle(4, 4, 10, 10);
        this.itemContainer.position.set(4, 4);
        this.itemContainer.width = 8;
        this.itemContainer.height = 8;
        this.addChild(this.itemContainer);
        this.itemContainer.filters = [new DropShadowFilter({blur: 0, distance: 2, rotation: 45, quality: 0})];
    }

    public update() {
        if (this.item === this.slot.item) return;
        this.item = this.slot.item;
        this.itemContainer.removeChildren();
        if (this.slot.item) {
            this.itemSprite = this.slot.item.getSprite();
            this.itemContainer.addChild(this.itemSprite);
        }
    }
}

export default class HotbarDisplay extends Display {
    public hasCommand = true;
    private mob: Mob;
    private slots: InventorySlot[] = [];
    private selectSprite?: PIXI.Sprite;
    private itemText?: PIXI.BitmapText;
    private textDelay: number = 0;
    private nbSlot: number = 9;

    constructor(mob: Mob) {
        super();
        this.mob = mob;
        this.init();
        this.position.x = (Renderer.getScreen().width - this.width) >> 1;
        this.position.y = Renderer.getScreen().height - this.height - 20;
    }

    public onTick(): void {
        super.onTick();
        this.slots.forEach((slot) => slot.update());
    }

    public onCommand() {
        super.onCommand();
        if (Game.input.getKey("INVENTORY").clicked) (new CraftingDisplay(Crafting.allRecipes, Game.player)).show();
        if (Game.input.getKey("MAP").clicked) (new MapDisplay()).show();
        if (Game.input.getKey("HOTBAR-1").clicked) this.mob.inventory.indexedSlot = 0;
        if (Game.input.getKey("HOTBAR-2").clicked) this.mob.inventory.indexedSlot = 1;
        if (Game.input.getKey("HOTBAR-3").clicked) this.mob.inventory.indexedSlot = 2;
        if (Game.input.getKey("HOTBAR-4").clicked) this.mob.inventory.indexedSlot = 3;
        if (Game.input.getKey("HOTBAR-5").clicked) this.mob.inventory.indexedSlot = 4;
        if (Game.input.getKey("HOTBAR-6").clicked) this.mob.inventory.indexedSlot = 5;
        if (Game.input.getKey("HOTBAR-7").clicked) this.mob.inventory.indexedSlot = 6;
        if (Game.input.getKey("HOTBAR-8").clicked) this.mob.inventory.indexedSlot = 7;
        if (Game.input.getKey("HOTBAR-9").clicked) this.mob.inventory.indexedSlot = 8;
        if (Game.input.getKey("DROP-ONE").clicked) {
            const slot = this.mob.inventory.selectedSlot();
            if (slot.isItem()) {
                const level = this.mob.getLevel();
                if (level && slot.item) {
                    this.mob.dropItem(slot.item);
                }
            }
        }
        if (Game.mouse.deltaY > 0) {
            this.mob.inventory.indexedSlot = (this.mob.inventory.indexedSlot + 1 + this.nbSlot) % this.nbSlot;
        }
        if (Game.mouse.deltaY < 0) {
            this.mob.inventory.indexedSlot = (this.mob.inventory.indexedSlot - 1 + this.nbSlot) % this.nbSlot;
        }
    }

    public onRender() {
        super.onRender();
        this.setCurrentSlot();
    }

    private init() {
        const baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "hotbar.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 112, 16)));
        this.selectSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(112, 0, 16, 16)));
        this.itemText = new PIXI.BitmapText("", {
            font: {
                name: "Epic",
                size: 16,
            },
            tint: Color.white.getInt(),
        });
        this.itemText.anchor = 0.5;
        const bar = new PIXI.Container();
        bar.filters = [new DropShadowFilter({blur: 0, distance: 1, rotation: 90, quality: 0})];
        bar.addChild(sprite);
        for (let i = this.nbSlot - 1; i >= 0; i--) {
            const slot = this.mob.inventory.slots[i];
            const x = (i % this.nbSlot) * 12;
            const slotSprite = new InventorySlot(slot, i);
            slotSprite.on("click", () => {
                this.mob.inventory.indexedSlot = slotSprite.index;
            });
            slotSprite.position.set(x, 0);
            this.slots.push(slotSprite);
            bar.addChild(slotSprite);
        }
        bar.addChild(this.selectSprite);
        bar.scale.set(4);
        this.addChild(bar, this.itemText);
        this.itemText.position.set(this.width / 2, -12);
    }

    private setCurrentSlot() {
        const index = this.mob.inventory.indexedSlot;
        const slot = this.mob.inventory.getSlot(index);
        let text = "";
        if (this.textDelay > 0) this.textDelay--;
        this.itemText.visible = (this.textDelay > 0);
        if (this.itemText && slot.isItem()) text = `${slot.item?.getDisplayName()} - ${slot.nb}`;
        if (text !== this.itemText.text) {
            this.textDelay = 100;
            this.itemText.text = text;
        }
        if (this.selectSprite && this.selectSprite.x !== index * 12) {
            this.selectSprite.x -= (this.selectSprite.x - (index * 12)) / 2;
        }
    }
}
