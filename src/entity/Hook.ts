import Entity from "./Entity";
import * as PIXI from "pixi.js";
import System from "../core/System";
import Fish from "./mob/Fish";
import {Mob, ItemEntity} from "./index";
import Items from "../item/Items";
import FishingRodItem from "../item/FishingRodItem";
import Level from "../level/Level";

export default class Hook extends Entity {
    private readonly owner: Entity;
    private hooked?: Fish;
    private fishingRodItem: FishingRodItem;

    constructor(owner: Entity, fishingRod: FishingRodItem) {
        super();
        this.owner = owner;
        this.fishingRodItem = fishingRod;
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
        if (!(this.owner instanceof Mob) || !(this.owner.inventory.selectedItem() instanceof FishingRodItem)) {
            return this.delete();
        }
        if (this.getDistance(this.owner) > 64) return this.delete();
    }

    public onRender() {
        super.onRender();
        if (this.isSwimming()) {
            this.container.pivot.y = this.isHooked() ? Math.sin(this.ticks * 2) : Math.sin(this.ticks / 4) * 0.5;
        }
    }

    public isHooked() {
        return this.hooked instanceof Fish;
    }

    public getFish() {
        if (!this.isHooked()) return;
        return this.hooked;
    }

    public hookFish(fish: Fish) {
        this.hooked = fish;
    }

    public unHookFish() {
        this.hooked = undefined;
    }

    public delete(level?: Level) {
        super.delete(level);
        this.fishingRodItem?.clearHook();
    }

    public pull(): boolean {
        const fish = this.getFish();
        this.delete();
        if (fish) {
            fish.delete();
            if (this.owner instanceof Mob && !this.owner.inventory.addItem(Items.FISH)) {
                this.owner.getLevel()?.addEntity(new ItemEntity(Items.FISH), this.owner.x, this.owner.y);
            }
            console.log("You catch a fish!");
            return true;
        }
        return false;
    }

    public canSwim(): boolean {
        return true;
    }

    protected friction() {
        if (this.z <= 0) {
            this.a.x -= this.a.x * 0.1;
            this.a.y -= this.a.y * 0.1;
        } else {
            this.a.x -= this.a.x * 0.01;
            this.a.y -= this.a.y * 0.01;
        }
    }
}
