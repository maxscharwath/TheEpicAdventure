import * as PIXI from "pixi.js";
import Entity from "../../entity/Entity";
import LevelTile from "../../level/LevelTile";

export default class Resource {
    public texture: PIXI.BaseTexture;
    public tag: string;

    constructor(tag: string, path: string) {
        this.tag = tag;
        this.texture = PIXI.BaseTexture.from(path);
        this.texture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        return false;
    }
}
