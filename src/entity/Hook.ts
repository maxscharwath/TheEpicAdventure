import Entity from "./Entity";
import * as PIXI from "pixi.js";
import System from "../core/System";
import Fish from "./mob/Fish";
import {Mob, ItemEntity} from "./index";
import Items from "../item/Items";
import FishingRodItem from "../item/FishingRodItem";

export default class Hook extends Entity {
    private readonly owner: Entity;
    private hooked: Fish;

    constructor(owner: Entity) {
        super();
        this.owner = owner;
    }

    public init() {
        super.init();
        this.hitbox.set(0, 0, 5, 5);
        const sprite = PIXI.Sprite.from(PIXI.Texture.from(System.getResource("entity", "hook.png")));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }

    public onTick() {
        super.onTick();
        if (!this.owner) this.delete();
    }

    public onRender() {
        super.onRender();
        if (this.isSwimming()) {
            this.container.pivot.y = Math.sin(this.ticks / 4) * 0.5;
        }
    }

    public isHooked() {
        return Boolean(this.hooked);
    }

    public getFish() {
        if (!(this.hooked instanceof Fish)) return;
        return this.hooked;
    }

    public hookFish(fish: Fish) {
        this.hooked = fish;
    }

    public pull(fishingRod: FishingRodItem): boolean {
        const fish = this.getFish();
        fishingRod.clearHook();
        this.delete();
        if (fish) {
            fish.delete();
            if (this.owner instanceof Mob && !this.owner.inventory.addItem(Items.FISH)) {
                this.owner.getLevel().addEntity(new ItemEntity(Items.FISH), this.owner.x, this.owner.y);
            }
            console.log("You catch a fish!");
            return true;
        }
        return false;
    }
}
