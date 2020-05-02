import Item from "./Item";
import ResourceItem from "./ResourceItem";
import Resources from "./resources/Resources";
import Tiers from "./Tiers";
import ToolItem from "./ToolItem";
import ToolType from "./ToolType";

type Type<T> = new (...args: any[]) => T;

interface ItemRegister<T> {
    readonly item: T;
    tag: string;
    class: Type<T>;
}

export default class Items {

    private static items = new Map<string, ItemRegister<any>>();

    private static registerItem<T>(tag: string, itemClass: Type<T>, ...args: any): ItemRegister<T> {
        const itemRegister = {
            tag,
            class: itemClass,
            get item(): T {
                return new itemClass(tag, ...args);
            },
        };
        this.items.set(tag, itemRegister);
        console.log(`adding ${itemClass.name} to biome list with tag "${tag}"`);
        return itemRegister;
    }

    public static WOOD_SHOVEL = Items.registerItem("wood_shovel", ToolItem, ToolType.shovel, Tiers.WOOD);
    public static WOOD_HOE = Items.registerItem("wood_hoe", ToolItem, ToolType.hoe, Tiers.WOOD);
    public static WOOD_AXE = Items.registerItem("wood_axe", ToolItem, ToolType.axe, Tiers.WOOD);
    public static WOOD_SWORD = Items.registerItem("wood_sword", ToolItem, ToolType.sword, Tiers.WOOD);
    public static WOOD_PICKAXE = Items.registerItem("wood_pickaxe", ToolItem, ToolType.pickaxe, Tiers.WOOD);

    public static WHEAT = Items.registerItem("wheat", ResourceItem, Resources.wheat);
    public static SEED_WHEAT = Items.registerItem("seed_wheat", ResourceItem, Resources.seedWheat);
    public static APPLE = Items.registerItem("apple", ResourceItem, Resources.apple);

    public static get(tag: string): ItemRegister<Item> {
        return this.items.get(tag);
    }
}
