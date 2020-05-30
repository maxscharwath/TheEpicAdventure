import Recipe from "./Recipe";
import Items from "../item/Items";

export default class Crafting {
    public static handRecipes: Recipe[] = [
        new Recipe(Items.WOOD_SHOVEL).addCost(Items.STICK, 3).addCost(Items.WOOD, 1),
        new Recipe(Items.WOOD_HOE).addCost(Items.STICK, 3).addCost(Items.WOOD, 2),
        new Recipe(Items.WOOD_SWORD).addCost(Items.STICK, 3).addCost(Items.WOOD, 2),
        new Recipe(Items.WOOD_AXE).addCost(Items.STICK, 3).addCost(Items.WOOD, 3),
        new Recipe(Items.WOOD_PICKAXE).addCost(Items.STICK, 3).addCost(Items.WOOD, 3),

        new Recipe(Items.STONE_SHOVEL).addCost(Items.STICK, 3).addCost(Items.WOOD, 1),
        new Recipe(Items.STONE_HOE).addCost(Items.STICK, 3).addCost(Items.STONE, 2),
        new Recipe(Items.STONE_SWORD).addCost(Items.STICK, 3).addCost(Items.STONE, 2),
        new Recipe(Items.STONE_AXE).addCost(Items.STICK, 3).addCost(Items.STONE, 3),
        new Recipe(Items.STONE_PICKAXE).addCost(Items.STICK, 3).addCost(Items.STONE, 3),

        new Recipe(Items.IRON_SHOVEL).addCost(Items.STICK, 3).addCost(Items.IRON, 1),
        new Recipe(Items.IRON_HOE).addCost(Items.STICK, 3).addCost(Items.IRON, 2),
        new Recipe(Items.IRON_SWORD).addCost(Items.STICK, 3).addCost(Items.IRON, 2),
        new Recipe(Items.IRON_AXE).addCost(Items.STICK, 3).addCost(Items.IRON, 3),
        new Recipe(Items.IRON_PICKAXE).addCost(Items.STICK, 3).addCost(Items.IRON, 3),

        new Recipe(Items.GOLD_SHOVEL).addCost(Items.STICK, 3).addCost(Items.GOLD, 1),
        new Recipe(Items.GOLD_HOE).addCost(Items.STICK, 3).addCost(Items.GOLD, 2),
        new Recipe(Items.GOLD_SWORD).addCost(Items.STICK, 3).addCost(Items.GOLD, 2),
        new Recipe(Items.GOLD_AXE).addCost(Items.STICK, 3).addCost(Items.GOLD, 3),
        new Recipe(Items.GOLD_PICKAXE).addCost(Items.STICK, 3).addCost(Items.GOLD, 3),

        new Recipe(Items.DIAMOND_SHOVEL).addCost(Items.STICK, 3).addCost(Items.DIAMOND, 1),
        new Recipe(Items.DIAMOND_HOE).addCost(Items.STICK, 3).addCost(Items.DIAMOND, 2),
        new Recipe(Items.DIAMOND_SWORD).addCost(Items.STICK, 3).addCost(Items.DIAMOND, 2),
        new Recipe(Items.DIAMOND_AXE).addCost(Items.STICK, 3).addCost(Items.DIAMOND, 3),
        new Recipe(Items.DIAMOND_PICKAXE).addCost(Items.STICK, 3).addCost(Items.DIAMOND, 3),

        new Recipe(Items.FISHING_ROD).addCost(Items.STICK, 3),
        new Recipe(Items.CHEST).addCost(Items.WOOD, 8),
        new Recipe(Items.BED).addCost(Items.WOOD, 8),
        new Recipe(Items.CAMP).addCost(Items.WOOD, 8),
        new Recipe(Items.MUSIC_PLAYER).addCost(Items.WOOD, 8),
    ];
}
