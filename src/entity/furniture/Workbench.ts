import * as PIXI from "pixi.js";
import System from "../../core/System";
import Craftable from "./Craftable";
import Crafting from "../../crafting/Crafting";

export default class Workbench extends Craftable {
    public static create({id, x, y}: any): Workbench {
        return super.create({id, x, y}) as Workbench;
    }
    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "workbench.png"));

    constructor() {
        super(Crafting.workbenchRecipes);
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    protected init() {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Workbench.baseTexture, new PIXI.Rectangle(0, 0, 16, 16)));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}