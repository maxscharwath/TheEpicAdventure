import * as PIXI from "pixi.js";
import uniqid from "uniqid";
import Localization from "../core/io/Localization";
import {Entity, Player} from "../entity/";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import Items from "./Items";

export default class Item {
    protected texture: PIXI.Texture = PIXI.Texture.EMPTY;

    public static create(data: any): Item {
        return Items.get(data.tag).item;
    }

    public craftedBy?: Mob;
    public tag: string;
    public uid: string = uniqid();

    constructor(tag: string) {
        this.tag = tag;
    }


    public getSprite(centred: boolean = false) {
        const sprite = new PIXI.Sprite(this.texture);
        if (centred) {
            sprite.anchor.set(0.5);
        }
        return sprite;
    }

    public interact(player: Player, entity: Entity): boolean {
        return false;
    }

    public interactOn(levelTile: LevelTile, entity: Entity): boolean {
        return false;
    }

    public canAttack(): boolean {
        return false;
    }

    public getDisplayName(): string {
        return Localization.get(`item.${this.tag}`);
    }

    public isStackable(): boolean {
        return false;
    }

    public toString(): string {
        return `${this.tag}#${this.uid}`;
    }

    public getTexture() {
        return this.texture;
    }

    public toBSON(): any {
        return {
            tag: this.tag,
        };
    }
}
