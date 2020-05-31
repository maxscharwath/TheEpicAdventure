import Entity from "../Entity";
import {Player, Mob} from "../index";
import Direction from "../Direction";

export default abstract class Furniture extends Entity {
    private pushDir: Direction = Direction.NONE;
    private pushTime: number = 0;

    constructor() {
        super();
        this.hitbox.set(0, 0, 14, 14);
    }

    public getSprite() {
        return this;
    }

    public blocks(entity: Entity): boolean {
        return true;
    }

    public onTick() {
        super.onTick();
        this.move(this.pushDir.getX(), this.pushDir.getY());
        this.pushDir = Direction.NONE;
        if (this.pushTime > 0) this.pushTime--;
    }

    public onUse(mob: Mob) {
        return false;
    }

    public touchedBy(entity: Entity) {
        if (entity instanceof Player && this.pushTime === 0) {
            this.pushDir = entity.getDir();
            this.pushTime = 10;
        }
    }
}
