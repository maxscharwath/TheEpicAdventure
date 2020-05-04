import * as PIXI from "pixi.js";
import Game from "../../core/Game";
import System from "../../core/System";
import SpriteSheet from "../../gfx/SpriteSheet";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Mob from "./Mob";

export default class Player extends Mob {
    protected speedMax: number = 1;

    protected init() {
        super.init();
        this.sprite = new PIXI.AnimatedSprite([PIXI.Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.targetTile = new PIXI.Sprite(PIXI.Texture.from(System.getResource("select.png")));
        this.targetTile.alpha = 0.7;
        this.container.addChild(this.sprite);
        this.addChildAt(this.targetTile, 0);
        this.playAnimation("walk");
    }

    protected steppedOn() {
        super.steppedOn();
    }

    protected move2(xa: number, ya: number): boolean {
        const godMod = false;
        if (godMod) {
            this.x += xa;
            this.y += ya;
            return true;
        }
        return super.move2(xa, ya);
    }

    private static spriteSheet = new SpriteSheet("player.json");
    private targetTile: PIXI.Sprite;
    private sprite: PIXI.AnimatedSprite;

    private playAnimation(name: string, loop: boolean = true): PIXI.AnimatedSprite {
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
        this.inventory.addItem(Items.WOOD_AXE);
        this.inventory.addItem(Items.WOOD_HOE);
        this.inventory.addItem(Items.WOOD_PICKAXE);
        this.inventory.addItem(Items.WOOD_SHOVEL);
        this.inventory.addItem(Items.WOOD_SWORD);
        this.inventory.addItem(Items.WHEAT, 16);
        this.inventory.addItem(Items.SEED_WHEAT, 2);
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
        const levelTile = this.getInteractTile();
        this.targetTile.position.set(levelTile?.x - this.x, levelTile?.y - this.y);
        if (Game.input.getKey("ATTACK").down) {
            const item = this.inventory.selectedItem();
            levelTile?.tile.onInteract(this, item);
            if (item instanceof Item) {
                item.useOn(levelTile, this);
            } else {
                this.attack(5);
            }
        }

        if (this.aSpeed < this.speed) {
            this.a.x += ax / 5;
            this.a.y += ay / 5;
        }
    }
}
