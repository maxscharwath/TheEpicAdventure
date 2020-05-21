import Furniture from "./Furniture";
import * as PIXI from "pixi.js";
import System from "../../core/System";
import DustParticle from "../particle/DustParticle";
import SpriteSheet from "../../gfx/SpriteSheet";

export default class Camp extends Furniture {
    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "camp.png"));
    private static frames = SpriteSheet.loadTextures(System.getResource("fire.png"), 32, 16);
    private active = true;
    private campFire: PIXI.AnimatedSprite;

    constructor() {
        super();
        this.hitbox.set(0, 3, 16, 10);
    }

    public onRender() {
        super.onRender();
        this.campFire.visible = this.active;
        if (this.active) {
            this.level.add(new DustParticle(this.x, this.y - 4));
        }
    }

    protected init() {
        const sprite = new PIXI.Sprite(new PIXI.Texture(Camp.baseTexture));
        sprite.anchor.set(0.5);
        this.campFire = new PIXI.AnimatedSprite(Camp.frames);
        this.campFire.play();
        this.campFire.animationSpeed = 0.5;
        this.campFire.y = -6;
        this.campFire.anchor.set(0.5);
        this.container.addChild(sprite, this.campFire);
    }
}
