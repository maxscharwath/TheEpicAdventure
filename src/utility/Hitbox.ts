import * as PIXI from "pixi.js";

export default class Hitbox extends PIXI.Sprite {
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    constructor(x = 0, y = 0, width = 0, height = 0) {
        super(PIXI.Texture.WHITE);
        this.set(x, y, width, height);
        this.anchor.set(0.5);
        this.alpha = 0.5;
        this.visible = false;
    }

    public set(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    public collision(hb: Hitbox): boolean {
        return !((hb.x >= this.x + this.width)
            || (hb.x + hb.width <= this.x)
            || (hb.y >= this.y + this.height)
            || (hb.y + hb.height <= this.y));
    }
}
