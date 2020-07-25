import * as PIXI from "pixi.js";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import Item from "./Item";
import Resource from "./resources/Resource";

export default class ResourceItem extends Item {

    constructor(tag: string, resource: Resource) {
        super(tag);
        this.resource = resource;
        this.texture = new PIXI.Texture(this.resource.texture);
    }
    private readonly resource: Resource;

    public isStackable(): boolean {
        return true;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.getCooldownTime() <= 5) return false;
        super.useOn(levelTile, mob);
        if (this.resource.useOn(levelTile, mob)) {
            mob.inventory.removeItem(this, 1);
            return true;
        }
        return false;
    }
}
