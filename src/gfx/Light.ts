import * as PIXI from "pixi.js";
export default class Light extends PIXI.Sprite {
    private tintColor = 0xffffff;
    private brightness = 1;
    constructor() {
        super(PIXI.Texture.WHITE);
        this.width = 16;
        this.height = 16;
        this.tint = 0xffffff;
        this.alpha = 1;
    }

    public setColor(color: number) {
        this.tintColor = color;
        this.updateTint();
        return this;
    }

    public setBrightness(value: number) {
        this.brightness = value;
        this.updateTint();
        return this;
    }

    private updateTint() {
        const color = this.tintColor;
        const r = ((color >> 16) & 0b11111111) * this.brightness;
        const g = ((color >> 8) & 0b11111111) * this.brightness;
        const b = (color & 0b11111111) * this.brightness;
        this.tint = ((r << 8) + g << 8) + b;
    }
}
