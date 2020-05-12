import Entity from "./Entity";
import * as PIXI from "pixi.js";
import System from "../core/System";

export default class Hook extends Entity {
    constructor() {
        super();
    }

    public init() {
        super.init();
        this.hitbox.set(0, 0, 5, 5);
        const sprite = PIXI.Sprite.from(PIXI.Texture.from(System.getResource("entity", "hook.png")));
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
    }

    public onRender() {
        super.onRender();
        if (this.isSwimming()) {
            this.container.pivot.y = Math.sin(this.ticks / 4) * 0.5;
        }
    }
}
