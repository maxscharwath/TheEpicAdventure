import Recipe from "../../crafting/Recipe";
import {Mob, Furniture} from "../index";
import CraftingDisplay from "../../screen/CraftingDisplay";
import Item from "../../item/Item";
import Game from "../../core/Game";

export default class Craftable extends Furniture {

    constructor(recipes: Array<Recipe> = []) {
        super();
        this.recipes = recipes;
    }
    private craftRecipe?: Recipe;
    private craftTime: number = 0;
    private readonly recipes: Array<Recipe>;

    public isCrafting() {
        return (this.craftTime > 0);
    }

    public isDoneCrafting() {
        return this.craftTime === 0 && this.craftRecipe instanceof Recipe;
    }

    public onCraft() {
    }

    public onTick() {
        super.onTick();
        if (this.craft()) {
            this.onCraft();
        }
    }

    public onUse(mob: Mob, item?: Item): boolean {
        Game.GUI.setDisplay(new CraftingDisplay(this.recipes, mob));
        return true;
    }

    protected craft() {
        if (this.craftTime > 0) {
            this.craftTime--;
            return true;
        }
        return false;
    }
}
