import Recipe from "../../crafting/Recipe";
import {Mob, Furniture} from "../index";
import CraftingDisplay from "../../screen/CraftingDisplay";

export default class Craftable extends Furniture {
    private craftTime: number = 0;
    private craftRecipe?: Recipe;
    private recipes: Recipe[];

    constructor(recipes: Recipe[] = []) {
        super();
        this.recipes = recipes;
    }

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

    public onUse(mob: Mob): boolean {
        (new CraftingDisplay(this.recipes , mob)).show();
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
