import Item from "./Item";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import BucketType from "./BucketType";

export default class BucketItem extends Item {

    public static create(data: any) {
        return super.create(data) as BucketItem;
    }

    private content: BucketType;

    constructor(tag: string, content = BucketType.EMPTY) {
        super(tag);
        this.content = content;
        this.texture = content.texture;
    }

    public isStackable() {
        return false;
    }

    public canAttack(): boolean {
        return true;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

}
