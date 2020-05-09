import * as PIXI from "pixi.js";
import System from "../core/System";

export default class ToolType {
    public static levelName = ["wood", "stone", "iron", "gold", "diamond"];
    public static hoe = new ToolType("hoe");
    public static shovel = new ToolType("shovel");
    public static axe = new ToolType("axe");
    public static pickaxe = new ToolType("pickaxe");
    public static sword = new ToolType("sword");
    public name: string;
    public textures: PIXI.Texture[] = [];

    private constructor(name: string) {
        this.name = name;
        for (const level of ToolType.levelName) {
            const texture = PIXI.Texture.from(System.getResource("items", `${level}_${name}.png`));
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.textures.push(texture);
        }
    }
}
