import Localization from "../core/io/Localization";
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
        console.log(`adding ${itemClass.name} to item list with tag "${tag}"`);
    }

    private static items = new Map<string, ItemRegister<Item>>();

    public static add<T extends Item>(tag: string, itemClass: Type<T>, ...args: any) {
        return new ItemRegister(tag, itemClass, ...args);
    }

    public static get(tag: string): ItemRegister<Item> {
        return this.items.get(tag);
    }

    public static verifyTag() {
        this.items.forEach((item) => {
            if (!Item.verifyTag(item.tag)) {
                console.warn(`'${item.tag}' didnt exist on ${Localization.getCurrent().getPath()}`);
            }
        });
    }

    public readonly tag: string;
    public readonly itemClass: Type<T>;
    public readonly args: any;
}

export default class Items extends ItemRegister<Item> {
    public static WOOD_AXE = Items.add("wood_axe", ToolItem, ToolType.axe, Tiers.WOOD);
    public static WOOD_HOE = Items.add("wood_hoe", ToolItem, ToolType.hoe, Tiers.WOOD);
    public static WOOD_PICKAXE = Items.add("wood_pickaxe", ToolItem, ToolType.pickaxe, Tiers.WOOD);
    public static WOOD_SHOVEL = Items.add("wood_shovel", ToolItem, ToolType.shovel, Tiers.WOOD);
    public static WOOD_SWORD = Items.add("wood_sword", ToolItem, ToolType.sword, Tiers.WOOD);

    public static STONE_AXE = Items.add("stone_axe", ToolItem, ToolType.axe, Tiers.STONE);
    public static STONE_HOE = Items.add("stone_hoe", ToolItem, ToolType.hoe, Tiers.STONE);
    public static STONE_PICKAXE = Items.add("stone_pickaxe", ToolItem, ToolType.pickaxe, Tiers.STONE);
    public static STONE_SHOVEL = Items.add("stone_shovel", ToolItem, ToolType.shovel, Tiers.STONE);
    public static STONE_SWORD = Items.add("stone_sword", ToolItem, ToolType.sword, Tiers.STONE);

    public static IRON_AXE = Items.add("iron_axe", ToolItem, ToolType.axe, Tiers.IRON);
    public static IRON_HOE = Items.add("iron_hoe", ToolItem, ToolType.hoe, Tiers.IRON);
    public static IRON_PICKAXE = Items.add("iron_pickaxe", ToolItem, ToolType.pickaxe, Tiers.IRON);
    public static IRON_SHOVEL = Items.add("iron_shovel", ToolItem, ToolType.shovel, Tiers.IRON);
    public static IRON_SWORD = Items.add("iron_sword", ToolItem, ToolType.sword, Tiers.IRON);

    public static GOLD_AXE = Items.add("gold_axe", ToolItem, ToolType.axe, Tiers.GOLD);
    public static GOLD_HOE = Items.add("gold_hoe", ToolItem, ToolType.hoe, Tiers.GOLD);
    public static GOLD_PICKAXE = Items.add("gold_pickaxe", ToolItem, ToolType.pickaxe, Tiers.GOLD);
    public static GOLD_SHOVEL = Items.add("gold_shovel", ToolItem, ToolType.shovel, Tiers.GOLD);
    public static GOLD_SWORD = Items.add("gold_sword", ToolItem, ToolType.sword, Tiers.GOLD);

    public static DIAMOND_AXE = Items.add("diamond_axe", ToolItem, ToolType.axe, Tiers.DIAMOND);
    public static DIAMOND_HOE = Items.add("diamond_hoe", ToolItem, ToolType.hoe, Tiers.DIAMOND);
    public static DIAMOND_PICKAXE = Items.add("diamond_pickaxe", ToolItem, ToolType.pickaxe, Tiers.DIAMOND);
    public static DIAMOND_SHOVEL = Items.add("diamond_shovel", ToolItem, ToolType.shovel, Tiers.DIAMOND);
    public static DIAMOND_SWORD = Items.add("diamond_sword", ToolItem, ToolType.sword, Tiers.DIAMOND);

    public static WHEAT = Items.add("wheat", ResourceItem, Resources.wheat);
    public static SEED_WHEAT = Items.add("seed_wheat", ResourceItem, Resources.seedWheat);
    public static APPLE = Items.add("apple", ResourceItem, Resources.apple);

    public static SNOWBALL = Items.add("snowball", ResourceItem, Resources.snowball);

    public static SAND = Items.add("sand", ResourceItem, Resources.sand);
    public static DIRT = Items.add("dirt", ResourceItem, Resources.dirt);
    public static STONE = Items.add("stone", ResourceItem, Resources.stone);

    public static STICK = Items.add("stick", ResourceItem, Resources.stick);
    public static WOOD = Items.add("wood", ResourceItem, Resources.wood);
    public static LILYPAD = Items.add("lilypad", ResourceItem, Resources.lilypad);
    public static ICE = Items.add("ice", ResourceItem, Resources.ice);
    public static CACTUS_FLOWER = Items.add("cactus_flower", ResourceItem, Resources.cactusFlower);
}
