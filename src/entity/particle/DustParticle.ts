import Particle from "./Particle";
import Random from "../../utility/Random";
import System from "../../core/System";
import * as PIXI from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";

export default class DustParticle extends Particle {

    private readonly sprite: PIXI.AnimatedSprite;

    constructor(x: number, y: number, startFrame = 0) {
        super(x, y);
        this.lifeDuration = Random.int(10) + 20;

        this.a.x = Random.gaussian() * 0.1;
        this.a.y = Random.gaussian() * 0.1;
        this.a.z = 0.1;
        this.gravity = 0;
        this.sprite = new PIXI.AnimatedSprite(
            SpriteSheet.loadTextures(System.getResource("particle", "dust.png"), 6, 8),
        );
        this.sprite.alpha = 0.8;
        this.sprite.anchor.set(0.5);
        this.sprite.animationSpeed = 0.2;
        this.sprite.loop = false;
        this.sprite.gotoAndPlay(startFrame);
        this.sprite.onComplete = () => {
            this.delete();
        };
        this.addChild(this.sprite);
    }
}
