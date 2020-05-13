import Item from "./Item";
import LevelTile from "../level/LevelTile";
import {Entity, Hook, Mob, ItemEntity} from "../entity";
import Tiles from "../level/tile/Tiles";
import * as PIXI from "pixi.js";
import System from "../core/System";
import Items from "./Items";

export default class FishingRodItem extends Item {

    public static create(data: any) {
        const item = super.create(data) as FishingRodItem;
        item.durability = data.durability;
        return item;
    }
    private hook: Hook;

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

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        if (!levelTile.instanceOf(Tiles.WATER.tile)) return false;
        if (this.hook) return this.hook.pull(this);
        this.hook = new Hook(entity);
        entity.getLevel().addEntity(this.hook, levelTile.x + 8, levelTile.y + 8);
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
