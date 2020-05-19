import Item from "./Item";
import LevelTile from "../level/LevelTile";
import {Hook, Mob} from "../entity";
import * as PIXI from "pixi.js";
import System from "../core/System";

export default class FishingRodItem extends Item {

    public static create(data: any) {
        const item = super.create(data) as FishingRodItem;
        item.durability = data.durability;
        return item;
    }
    private hook?: Hook;

    private readonly durabilityMax: number = 50;
    private durability: number = this.durabilityMax;

    constructor() {
        super("fishing_rod");
        this.texture = PIXI.Texture.from(System.getResource("items", "fishing_rod.png"));
    }

    public fix(amount: number) {
        this.durability = Math.min(this.durability + amount, this.durabilityMax);
    }

    public isStackable() {
        return false;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.hook) return this.hook.pull();
        this.hook = new Hook(mob, this);
        this.hook.a.x = mob.getDir().getX();
        this.hook.a.y = mob.getDir().getY();
        this.hook.a.z = 2;
        mob.getLevel()?.add(this.hook, mob.x + mob.getDir().getX() * 10, mob.y + mob.getDir().getY() * 10);
        return true;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            durability: this.durability,
        };
    }

    public clearHook() {
        this.hook = undefined;
    }
}
