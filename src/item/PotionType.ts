import * as PIXI from "pixi.js";
import Color from "../utility/Color";
import System from "../core/System";

export default class PotionType {
    public static speed = new PotionType("speed", 1000, Color.fromHex("#54ceff"), "speed.png", 800);
    public static heal = new PotionType("heal", 500, Color.fromHex("#e226c4"), "img/effect/heal.png", 1200);
    public static power = new PotionType("power", 1000, Color.fromHex("#e20002"), "img/effect/strength.png", 1500);
    public static slow = new PotionType("slow", 1000, Color.fromHex("#27a63e"), "img/effect/slow.png", 500);
    public static hunger = new PotionType("hunger", 1000, Color.fromHex("#6c321d"), "img/effect/hunger.png", 100);
    public tag: string;
    public duration: number;
    public color: Color;
    public icon: PIXI.Texture;
    public brewDuration: number;
    constructor(tag: string, duration: number, color: Color, icon: string, brewDuration= 400) {
        this.tag = tag;
        this.duration = duration;
        this.color = color;
        this.icon = PIXI.Texture.from(System.getResource("effect", icon));
        this.brewDuration = brewDuration;
    }
}
