import Item from "./Item";
import ResourceItem from "./ResourceItem";
import Resources from "./resources/Resources";
import Tiers from "./Tiers";
import ToolItem from "./ToolItem";
import ToolType from "./ToolType";

type Type<T> = new (...args: any[]) => T;

export class ItemRegister<T extends Item> {
    public get item(): T {
        return new this.itemClass(this.tag, ...this.args);
    }

    protected constructor(tag: string, itemClass: Type<T>, ...args: any) {
        this.tag = tag;
        this.itemClass = itemClass;
        this.args = args;
        ItemRegister.items.set(tag, this);
        console.log(`adding ${itemClass.name} to biome list with tag "${tag}"`);
    }

    private static items = new Map<string, ItemRegister<any>>();

    public static add<T extends Item>(tag: string, itemClass: Type<T>, ...args: any) {
        return new ItemRegister(tag, itemClass, ...args);
    }

    public static get(tag: string): ItemRegister<Item> {
        return this.items.get(tag);
    }

    public readonly tag: string;
    public readonly itemClass: Type<T>;
    public readonly args: any;
}

export default class Items extends ItemRegister<Item> {
    public static WOOD_SHOVEL = Items.add("wood_shovel", ToolItem, ToolType.shovel, Tiers.WOOD);
    public static WOOD_HOE = Items.add("wood_hoe", ToolItem, ToolType.hoe, Tiers.WOOD);
    public static WOOD_AXE = Items.add("wood_axe", ToolItem, ToolType.axe, Tiers.WOOD);
    public static WOOD_SWORD = Items.add("wood_sword", ToolItem, ToolType.sword, Tiers.WOOD);
    public static WOOD_PICKAXE = Items.add("wood_pickaxe", ToolItem, ToolType.pickaxe, Tiers.WOOD);

    public static WHEAT = Items.add("wheat", ResourceItem, Resources.wheat);
    public static SEED_WHEAT = Items.add("seed_wheat", ResourceItem, Resources.seedWheat);
    public static APPLE = Items.add("apple", ResourceItem, Resources.apple);

    public static SNOWBALL = Items.add("snowball", ResourceItem, Resources.snowball);

    public static SAND = Items.add("sand", ResourceItem, Resources.sand);
    public static DIRT = Items.add("dirt", ResourceItem, Resources.dirt);
}
