import Item from "./Item";
import {Furniture} from "../entity";
import LevelTile from "../level/LevelTile";
import Mob from "../entity/mob/Mob";
import * as PIXI from "pixi.js";
import System from "../core/System";

export default class FurnitureItem extends Item {

    public static create(data: any) {
        return super.create(data) as FurnitureItem;
    }
    private readonly furniture: Furniture;

    constructor(tag: string, furniture: typeof Furniture|Furniture) {
        super(tag);
        // @ts-ignore
        if (!(furniture instanceof Furniture)) this.furniture = new furniture();
        else this.furniture = furniture;
        this.texture = PIXI.Texture.from(System.getResource("items", `${tag}.png`));
    }

    public isStackable() {
        return false;
    }

    public getFurnitureSprite() {
        return this.furniture.getSprite();
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.getCooldownTime() <= 5) return false;
        super.useOn(levelTile, mob);
        if (levelTile.tile?.mayPass(this.furniture)) {
            if (levelTile.level.add(this.furniture, levelTile.x + 8, levelTile.y + 8)) {
                mob.inventory.removeItem(this, 1);
                return true;
            }
        }
        return false;
    }

    public canAttack(): boolean {
        return true;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }
}
