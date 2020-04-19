import * as PIXI from "pixi.js";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import Item from "./Item";
import Resource from "./resources/Resource";

export default class ResourceItem extends Item {
    private resource: Resource;
    constructor(resource: Resource) {
        super();
        this.resource = resource;
        this.texture = new PIXI.Texture(this.resource.texture);
    }

    public isStackable(): boolean {
        return true;
    }

    public get name() {
        return this.resource.tag;
    }

    public useOn(levelTile: LevelTile, mob: Mob) {
        return mob.inventory.removeItem(this, 1);
    }
}
