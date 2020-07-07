import * as PIXI from "pixi.js";
import System from "../core/System";

export default class BucketType {
    public static readonly EMPTY = new BucketType("empty", "bucket_empty.png");
    public static readonly WATER = new BucketType("water", "bucket_water.png");
    public static readonly LAVA = new BucketType("lava", "bucket_lava.png");
    public static readonly MILK = new BucketType("milk", "bucket_milk.png");

    public readonly name: string;
    public readonly texture: PIXI.Texture;

    private constructor(name: string, path: string) {
        this.name = name;
        this.texture = PIXI.Texture.from(System.getResource("items", path));
    }
}
