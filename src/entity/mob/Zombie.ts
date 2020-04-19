import {AnimatedSprite, Texture} from "pixi.js";
import SpriteSheet from "../../gfx/SpriteSheet";
import HostileMob from "./HostileMob";

export default class Zombie extends HostileMob {
    protected speedMax: number = 1;

    protected init() {
        super.init();
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);
        this.playAnimation("walk");
    }
    private static spriteSheet = new SpriteSheet("zombie.json");
    private sprite: AnimatedSprite;

    private playAnimation(name: string, loop: boolean = true): AnimatedSprite {
        const a = Zombie.spriteSheet.getAnimation(name, this.dir);
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

    public tick(): void {
        super.tick();
        if (Math.abs(this.a.get2dMagnitude()) > 0.1) {
            this.playAnimation("walk");
        } else {
            this.playAnimation("idle");
        }
    }
}
