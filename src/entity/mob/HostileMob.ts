import Mob from "./Mob";
import {Entity} from "../";
import Renderer from "../../core/Renderer";
import Maths from "../../utility/Maths";

export default abstract class HostileMob extends Mob {
    protected target: { x: number, y: number } = {x: 0, y: 0};

    constructor() {
        super();
        this.newTarget();
    }

    public onTick(): void {
        super.onTick();
        if (this.target instanceof Entity && this.target.getRemoved() ||
            !(this.target instanceof Entity) && this.random.probability(100)) {
            this.newTarget();
        }
    }

    public canSwim(): boolean {
        if (this.isOnFire) return true;
        return false;
    }

    public onRender() {
        super.onRender();
        let speedX = this.speed;
        let speedY = this.speed;
        let xa = 0;
        let ya = 0;

        if (this.target) {
            if (this.x > this.target.x) xa = -1;
            if (this.x < this.target.x) xa = 1;
            if (this.y > this.target.y) ya = -1;
            if (this.y < this.target.y) ya = 1;
        }

        const absX = Maths.abs(this.x - this.target.x);
        const absY = Maths.abs(this.y - this.target.y);
        if (absX <= speedX) {
            speedX = absX;
        }
        if (absY <= speedY) {
            speedY = absY;
        }


        if (this.aSpeed < this.speed) {
            this.a.x += xa / 10;
            this.a.y += ya / 10;
        }
    }

    protected newTarget() {
        this.target = {
            x: this.random.int(Renderer.WIDTH * -10, Renderer.WIDTH * 10),
            y: this.random.int(Renderer.HEIGHT * -10, Renderer.HEIGHT * 10),
        };
    }
}
