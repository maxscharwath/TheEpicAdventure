import * as PIXI from "pixi.js";
import System from "../../core/System";
import Vector from "../../utility/Vector";
import AquaticMob from "./AquaticMob";
import {Hook} from "../index";

export default class Fish extends AquaticMob {
    protected speedMax: number = 1;

    private lifeDuration = 0;

    private vector: Vector = new Vector();

    private points: PIXI.Point[];
    private hooked?: Hook;

    constructor() {
        super();
        this.lifeDuration = 1000;
    }

    public canSwim(): boolean {
        return true;
    }

    public die(): void {
    }

    public onTick(): void {
        super.onTick();
        if (!this.hooked && --this.lifeDuration <= 0) {
            this.delete();
        }

        if (this.target instanceof Hook && this.target.isHooked() && this.target.getFish() !== this) {
            this.newTarget();
        }

        if (this.target instanceof Hook && !this.target.isHooked() && this.getDistance(this.target) < 8) {
            this.hooked = this.target as Hook;
            this.hooked.hookFish(this);
        }

        if (this.hooked && this.random.probability(20)) {
            this.hooked.unHookFish();
            this.hooked = undefined;
            this.newTarget();
        }
    }

    public onRender() {
        super.onRender();

        if (this.a.magnitude > 0.5) {
            this.vector.x -= (this.vector.x - this.a.x) / 30;
            this.vector.y -= (this.vector.y - this.a.y) / 30;
        }

        this.container.rotation = -this.vector.rotation - Math.PI / 2;
        this.points[2].y = Math.sin(this.ticks) * this.a.get2dMagnitude() * 2;
    }

    protected newTarget() {
        if (!this.level || this.hooked) return;
        if (this.random.probability(10)) {
            this.level.findEntity(Hook, (hook) =>
                hook.isSwimming() && !hook.getRemoved() && !hook.isHooked())
                .then((hook) => {
                    this.target = hook;
                });
        } else {
            super.newTarget();
        }
    }

    protected init() {
        super.init();
        this.container.scale.set(this.random.number(0.25, 1));
        this.hitbox.set(0, 0, 8 * this.container.scale.x, 8 * this.container.scale.y);
        this.points = [];
        this.points.push(new PIXI.Point(0, 0));
        this.points.push(new PIXI.Point(8, 0));
        this.points.push(new PIXI.Point(16, 0));
        const strip = new PIXI.SimpleRope(
            PIXI.Texture.from(System.getResource("entity", "fish_shadow.png")),
            this.points,
        );
        strip.pivot.x = 5;
        strip.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.container.addChild(strip);
    }

    protected calculateZIndex(): number {
        return -Infinity;
    }
}
