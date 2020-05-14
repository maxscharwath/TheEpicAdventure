import {Mob} from ".";
import Item from "../item/Item";
import {ItemRegister} from "../item/Items";
import Entities from "./Entities";
import Entity from "./Entity";
import {DropShadowFilter} from "@pixi/filter-drop-shadow";

export default class ItemEntity extends Entity {

    public static create({id, item, x, y}: any): ItemEntity | undefined {
        const EntityClass = Entities.getByTag(id);
        return !EntityClass ? undefined : new EntityClass(Item.create(item), x, y) as ItemEntity;
    }

    public item: Item;
    private readonly shadow: PIXI.filters.DropShadowFilter;
    private readonly lifeTime: number;
    private time: number = 0;

    constructor(item: Item | ItemRegister<Item>, x?: number, y?: number) {
        super();
        if (x) this.x = x;
        if (y) this.y = y;
        this.z = 2;
        this.hitbox.set(0, 0, 8, 8);
        this.a.x = this.random.gaussian() * 0.3;
        this.a.y = this.random.gaussian() * 0.2;
        this.a.z = this.random.float() * 0.7 + 1;
        this.item = (item instanceof ItemRegister) ? item.item : item;
        this.lifeTime = 60 * 10 + this.random.int(70);
        this.container.addChild(this.item.getSprite(true));
        this.shadow = new DropShadowFilter({blur: 0, distance: 10, rotation: 90, quality: 0});
        this.filters = [this.shadow];
    }

    public onTick(): void {
        super.onTick();
        this.time++;
        if (this.time >= this.lifeTime / 100 * 75 && this.z === 0) {
            this.a.x = this.random.gaussian() * 0.3;
            this.a.y = this.random.gaussian() * 0.2;
            this.a.z = this.random.float() * 0.7 + 1;
        }
        if (this.time >= this.lifeTime) {
            this.delete();
            return;
        }
    }

    public onRender() {
        super.onRender();
        if (this.isSwimming()) {
            this.offset.y = Math.sin(this.ticks / 10) * 1.5;
        }
        this.shadow.distance = this.z * 4;
    }

    public touchedBy(entity: Entity) {
        if (this.deleted) return;
        if (entity instanceof Mob && this.onGround()) {
            entity.touchItem(this);
        }
    }

    public take(entity: Entity) {
        this.delete();
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            item: this.item,
        };
    }
}
