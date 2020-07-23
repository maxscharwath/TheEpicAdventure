import * as PIXI from "pixi.js";
import Tickable from "../Tickable";
import Random from "../../utility/Random";
import Vector3D from "../../utility/Vector3D";
import Level from "../../level/Level";
import Chunk from "../../level/Chunk";

export default class Particle extends PIXI.Container implements Tickable {

    private static random = new Random();
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    public a: Vector3D = new Vector3D();
    public ticks: number = 0;
    protected random = Particle.random;
    protected level?: Level;
    protected deleted: boolean = false;
    protected lifeDuration = 5;
    protected gravity: number = 0;
    protected life: number = 0;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    public remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public onTick() {
        if (this.life < this.lifeDuration) {
            ++this.life;
        } else {
            this.delete();
        }
    }

    public onRender() {
        this.x += this.a.x;
        this.y += this.a.y;
        this.z += this.a.z;
        this.pivot.y = this.z;
        this.zIndex = this.getZIndex();
    }

    public getRemoved(): boolean {
        return this.deleted;
    }

    public setLevel(level: Level): void {
        this.level = level;
    }

    public getChunk(): Chunk | undefined {
        return this.level?.getChunk(this.x >> 8, this.y >> 8);
    }

    public getLevel(): Level | undefined {
        return this.level;
    }

    public add() {
        this.level?.sortableContainer.addChild(this);
    }

    public delete(level?: Level): void {
        this.remove();
        if (level === undefined) {
            this.deleted = true;
            if (this.level instanceof Level) this.level.remove(this);
            return;
        }
        if (level === this.level) {
            this.deleted = true;
            this.level = undefined;
            this.destroy({children:true});
        }
    }

    protected getZIndex(): number {
        return this.y + this.z;
    }

    protected lifePercent() {
        return this.life / this.lifeDuration;
    }
}
