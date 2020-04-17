import Renderer from "../../core/Renderer";
import Maths from "../../utility/Maths";
import Entity from "../Entity";
import Mob from "./Mob";

export default class HostileMob extends Mob {
    protected target = {x: 0, y: 0};

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.newTarget();
    }

    public tick(): void {
        super.tick();
        let speedX = this.speed;
        let speedY = this.speed;
        let xa = 0;
        let ya = 0;


        if (this.x > this.target.x) {
            xa = -1;
        }
        if (this.x < this.target.x) {
            xa = 1;
        }
        if (this.y > this.target.y) {
            ya = -1;
        }
        if (this.y < this.target.y) {
            ya = 1;
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

        if (!(this.target instanceof Entity) && this.random.int(100) === 0) {
            this.newTarget();
        }
    }

    public touchedBy(entity: Entity): void {
        // if(!(entity instanceof HostileMob)){
        //     this.target = entity;
        // }
    }

    protected newTarget() {
        this.target = {
            x: this.random.int(Renderer.WIDTH * -10, Renderer.WIDTH * 10),
            y: this.random.int(Renderer.HEIGHT * -10, Renderer.HEIGHT * 10),
        };
    }
}
