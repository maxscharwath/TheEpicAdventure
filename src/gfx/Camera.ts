import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";

export default class Camera {

    public get x() {
        return (this.cx);
    }

    public get y() {
        return (this.cy);
    }

    public get zoom(): number {
        return this._zoom;
    }

    public set zoom(value: number) {
        if (value < 0.5) {
            value = 0.5;
        }
        this._zoom = value;
    }

    public follow: { x: number; y: number; } = null;
    public fx: number = 0;
    public fy: number = 0;
    public cx: number = 0;
    public cy: number = 0;
    private container: PIXI.Container;

    private _zoom: number = 4;

    constructor() {
    }

    public setPos(x: number, y: number) {
        this.fx = x;
        this.fy = y;
        this.follow = null;
    }

    public setFollow(obj: { x: number, y: number }) {
        if (obj instanceof Object) {
            if ("x" in obj && "y" in obj) {
                this.follow = obj;
                return true;
            }
        }
        return false;
    }

    public update(): void {
        this.move();
        if (this.container instanceof PIXI.Container) {
            this.container.position.set(Renderer.getScreen().width / 2, Renderer.getScreen().height / 2);
            this.container.pivot.set(this.x, this.y);
            this.container.scale.set(this.zoom);
        }
    }

    public setContainer(container: PIXI.Container) {
        this.container = container;
    }

    private move() {
        if (this.follow instanceof Object) {
            if ("x" in this.follow && "y" in this.follow) {
                this.fx = this.follow.x;
                this.fy = this.follow.y;
            }
        }
        this.fx += 3;

        const dX = this.cx - this.fx;
        const dY = this.cy - this.fy;
        const dist = Math.hypot(dX, dY);
        if (dist <= 0) {
            return;
        }
        let angle;
        if (dY < 0) {
            angle = Math.acos(dX / dist);
        } else {
            angle = Math.PI + Math.acos(-dX / dist);
        }
        const d = (Math.hypot((this.fx - this.cx), (this.fy - this.cy)));

        // console.log(d);
        const speed = d / (30 / this.zoom) * Updater.delta;

        this.cx += -speed * Math.cos(angle);
        this.cy += speed * Math.sin(angle);
    }
}
