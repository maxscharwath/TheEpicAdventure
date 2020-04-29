import {AnimatedSprite, Texture} from "pixi.js";
import Game from "../../core/Game";
import SpriteSheet from "../../gfx/SpriteSheet";
import Mob from "./Mob";

export default class Player extends Mob {
    protected speedMax: number = 1;

    protected init() {
        super.init();
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);
        this.playAnimation("walk");
    }

    protected steppedOn() {
        super.steppedOn();
    }

    // GODMOD
    protected move2(xa: number, ya: number): boolean {
        this.x += xa;
        this.y += ya;
        return true;
    }

    private static spriteSheet = new SpriteSheet("player.json");
    private sprite: AnimatedSprite;

    private playAnimation(name: string, loop: boolean = true): AnimatedSprite {
        const a = Player.spriteSheet.getAnimation(name, this.dir);
        if (this.sprite.textures === a) {
            return;
        }
        this.sprite.textures = a;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.sprite.loop = loop;
        return this.sprite;
    }

    constructor() {
        super();
        this.inventory.addSlots(19);
    }

    public destroy(): void {
        return;
    }

    public canSwim(): boolean {
        return true;
    }

    public die(): void {
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
        let ax = 0;
        let ay = 0;
        if (Game.input.getKey("MOVE-RIGHT").down) {
            ax += 1;
        }
        if (Game.input.getKey("MOVE-LEFT").down) {
            ax += -1;
        }
        if (Game.input.getKey("MOVE-DOWN").down) {
            ay += 1;
        }
        if (Game.input.getKey("MOVE-UP").down) {
            ay += -1;
        }

        if (Game.input.getKey("JUMP").clicked && this.z === 0) {
            this.a.z = 3;
        }

        if (Game.input.getKey("ATTACK").down) {
            this.attack(5);
        }

        if (this.aSpeed < this.speed) {
            this.a.x += ax / 5;
            this.a.y += ay / 5;
        }
    }
}
