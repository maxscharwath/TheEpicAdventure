import Particle from "./Particle";
import Random from "../../utility/Random";
import * as PIXI from "pixi.js";

export default class DamageParticle extends Particle {

    constructor(x: number, y: number, value: number = 0, color = 0xffffff) {
        super(x, y);
        this.lifeDuration = Random.int(5) + 10;

        this.a.x = this.random.gaussian() * 0.3;
        this.a.y = this.random.gaussian() * 0.2;
        this.a.z = this.random.float() * 0.7 + 1;
        this.gravity = 0.15;
        this.sprite = new PIXI.BitmapText(`${value}`, {
            fontName: "Epic",
            fontSize: 6,
            tint: color,
        });
        this.sprite.anchor = 0.5;
        this.addChild(this.sprite);
    }
    private readonly sprite: PIXI.BitmapText;

    public onRender() {
        super.onRender();
        if (this.z < 0) {
            this.z = 0;
            this.a.z *= -0.5;
            this.a.x *= 0.6;
            this.a.y *= 0.6;
        }
        this.a.z -= this.gravity;
    }

    public onTick() {
        super.onTick();
    }

}
