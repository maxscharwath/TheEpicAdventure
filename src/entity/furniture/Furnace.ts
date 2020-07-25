import * as PIXI from "pixi.js";
import System from "../../core/System";
import Craftable from "./Craftable";
import Crafting from "../../crafting/Crafting";
import Rectangle = PIXI.Rectangle;

export default class Furnace extends Craftable {

    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "furnace.png"));

    public static create({id, x, y}: any): Furnace {
        return super.create({id, x, y}) as Furnace;
    }

    constructor() {
        super(Crafting.furnaceRecipes);
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
        };
    }

    protected init() {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Furnace.baseTexture, new Rectangle(0, 0, 16, 16)));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }
}
