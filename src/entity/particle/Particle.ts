import Entity from "../Entity";

export default class Particle extends Entity {
    protected lifeDuration = 5;
    protected gravity: number = 0;
    protected life: number = 0;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    public onTick() {
        if (this.life < this.lifeDuration) {
            ++this.life;
        } else {
            this.remove();
        }
    }

    public onRender() {
        this.x += this.a.x;
        this.y += this.a.y;
        this.z += this.a.z;
        this.zIndex = this.y + this.z;
        this.pivot.y = this.z;
    }
}
