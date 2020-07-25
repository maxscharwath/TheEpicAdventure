import Item from "./Item";
import Mob from "../entity/mob/Mob";
import LevelTile from "../level/LevelTile";
import BucketType from "./BucketType";
import Tiles from "../level/tile/Tiles";

export default class BucketItem extends Item {

    private content: BucketType;

    constructor(tag: string, content = BucketType.EMPTY) {
        super(tag);
        this.setContent(content);
    }

    public static create(data: any) {
        return super.create(data) as BucketItem;
    }

    public isStackable() {
        return false;
    }

    public canAttack(): boolean {
        return true;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.content === BucketType.EMPTY) {
            if (levelTile.is(BucketType.WATER.tile)) {
                this.setContent(BucketType.WATER);
                levelTile.setTile(Tiles.HOLE);
            } else if (levelTile.is(BucketType.LAVA.tile)) {
                this.setContent(BucketType.LAVA);
                levelTile.setTile(Tiles.HOLE);
            }
        } else {
            if (levelTile.is(Tiles.HOLE) && this.content.tile) {
                levelTile.setTile(this.content.tile);
                this.setContent(BucketType.EMPTY);
            }
        }
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    private setContent(content = BucketType.EMPTY) {
        this.content = content;
        this.texture = content.texture;
    }

}
