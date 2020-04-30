import {AnimatedSprite, Texture} from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";
import HostileMob from "./HostileMob";

export default class Chicken extends HostileMob {
    protected speedMax: number = 1;

    protected init() {
        super.init();
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);
        this.playAnimation("walk");
    }
    private static spriteSheet = new SpriteSheet("chicken.json");
    private sprite: AnimatedSprite;

    private playAnimation(name: string, loop: boolean = true): AnimatedSprite {
        const a = Chicken.spriteSheet.getAnimation(name, this.dir);
        if (this.sprite.textures === a) {
            return;
        }
        this.sprite.textures = a;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.sprite.loop = loop;
        return this.sprite;
    }

    public canSwim(): boolean {
        return false;
    }

    public onTick(): void {
        super.onTick();
    }

    public onRender() {
        super.onRender();
        if (Math.abs(this.a.get2dMagnitude()) > 0.1) {
            this.playAnimation("walk");
        } else {
            this.playAnimation("idle");
        }
    }
}
