import {Mob} from "../entity";
import Item from "../item/Item";
import ResourceItem from "../item/ResourceItem";
import Resource from "../item/resources/Resource";

export default class Recipe {
    private readonly resultItem: Item;
    private cost: Array<[Item, number]> = [];
    private canCraft = false;
    private craftTime = 50;

    public static create(data: any) {

    }

    constructor(resultItem: Item) {
        this.resultItem = resultItem;
    }

    public setCraftTime(t: number) {
        this.craftTime = t;
        return this;
    }

    public addCost(resource: Resource | Item, count: number) {
        if (resource instanceof Resource) {
            this.cost.push([new ResourceItem("", resource), count]);
        }
        if (resource instanceof Item) {
            this.cost.push([resource, count]);
        }
        return this;
    }

    public checkCanCraft(mob: Mob) {
        for (const cost of this.cost) {
            const item = cost[0];
            const count = cost[1];
            if (item instanceof Item) {
                if (!mob.inventory.hasItem(item, count)) {
                    this.canCraft = false;
                    return;
                }
            }
        }
        this.canCraft = true;
    }

    public craft(mob: Mob) {
        const item = this.resultItem;
        item.craftedBy = mob;
        return mob.inventory.addItem(item);
    }

    public deductCost(mob: Mob) {
        for (const cost of this.cost) {
            const item = cost[0];
            const count = cost[1];
            if (item instanceof Item) {
                mob.inventory.removeItem(item, count);
            }
        }
    }

    public toBSON() {
        return {
            resultItem: this.resultItem,
            craftTime: this.craftTime,
        };
    }
}
