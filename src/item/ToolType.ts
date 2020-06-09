import * as PIXI from "pixi.js";
import System from "../core/System";

export default class ToolType {
    public static readonly levelName = ["wood", "stone", "iron", "gold", "diamond"];
    public static readonly  hoe = new ToolType("hoe");
    public static readonly  shovel = new ToolType("shovel");
    public static readonly  axe = new ToolType("axe");
    public static readonly  pickaxe = new ToolType("pickaxe");
    public static readonly  sword = new ToolType("sword");
    public readonly name: string;
    public readonly textures: PIXI.Texture[] = [];

    private constructor(name: string) {
        this.name = name;
        for (const level of ToolType.levelName) {
            const texture = PIXI.Texture.from(System.getResource("items", `${level}_${name}.png`));
            texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.textures.push(texture);
        }
    }
}
