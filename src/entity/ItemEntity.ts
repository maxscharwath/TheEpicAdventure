import Item from "../item/Item";
import Entity from "./Entity";
import Mob from "./mob/Mob";

export default class ItemEntity extends Entity {
    public item: Item;
    private readonly lifeTime: number;
    private time: number = 0;

    constructor(item: Item, x?: number, y?: number) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.z = 2;
        this.hitbox.set(0, 0, 8, 8);
        this.a.x = this.random.gaussian() * 0.3;
        this.a.y = this.random.gaussian() * 0.2;
        this.a.z = this.random.float() * 0.7 + 1;
        this.item = item;
        this.lifeTime = 60 * 10 + this.random.int(70);
        this.container.addChild(this.item.getSprite(true));
    }

    public tick(): void {
        super.tick();
        this.time++;
        if (this.time >= this.lifeTime) {
            this.remove();
            return;
        }
    }

    public touchedBy(entity: Entity) {
        if (entity instanceof Mob) {
            if (this.onGround()) {
                entity.touchItem(this);
            }
        }
    }

    public take(entity: Entity) {
        this.remove();
    }
}
