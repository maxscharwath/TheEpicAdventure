import * as PIXI from "pixi.js";
import uniqid from "uniqid";
import Localization from "../core/io/Localization";
import Entity from "../entity/Entity";
import Mob from "../entity/mob/Mob";
import Player from "../entity/mob/Player";
import LevelTile from "../level/LevelTile";

export default class Item {
    public readonly tag: string;
    public uid: string = uniqid();
    protected texture: PIXI.Texture = PIXI.Texture.EMPTY;
    protected craftedBy?: Mob;

    public getSprite(centred: boolean= false) {
        const sprite = new PIXI.Sprite(this.texture);
        if (centred) {sprite.anchor.set(0.5); }
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
}
