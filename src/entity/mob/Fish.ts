import * as PIXI from "pixi.js";
import AquaticMob from "./AquaticMob";

export default class Fish extends AquaticMob {
    protected speedMax: number = 1;

    protected init() {
        super.init();
        this.container.scale.set(this.random.number(0.25, 1));
        this.hitbox.set(0, 0, 8 * this.container.scale.x, 8 * this.container.scale.y);
        this.points = [];
        this.points.push(new PIXI.Point(0, 0));
        this.points.push(new PIXI.Point(8, 0));
        this.points.push(new PIXI.Point(16, 0));
        const strip = new PIXI.SimpleRope(PIXI.Texture.from("src/resources/entity/fish_shadow.png"), this.points);
        strip.pivot.x = 5;
        strip.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.container.addChild(strip);
    }

    protected calculateZIndex(): number {
        return -Infinity;
    }

    protected steppedOn() {
        super.steppedOn();
    }

    private points: PIXI.Point[];

    constructor() {
        super();
    }

    public canSwim(): boolean {
        return true;
    }

    public die(): void {
    }

    public onTick(): void {
        super.onTick();
    }

    public onRender() {
        super.onRender();
        this.container.rotation = -this.a.rotation - Math.PI / 2;
        this.points[2].y = Math.sin(this.ticks) * this.a.get2dMagnitude() * 2;
    }
}
