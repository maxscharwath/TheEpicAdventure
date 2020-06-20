import * as PIXI from "pixi.js";
import Game from "../../core/Game";
import System from "../../core/System";
import SpriteSheet from "../../gfx/SpriteSheet";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Mob from "./Mob";
import FishingRodItem from "../../item/FishingRodItem";
import FurnitureItem from "../../item/FurnitureItem";
import {Furniture} from "../index";

export default class Player extends Mob {

    private static spriteSheet = new SpriteSheet("player.json");
    protected speedMax: number = 1;
    private targetTile?: PIXI.Sprite;
    private holdItemContainer: PIXI.Container;
    private sprite?: PIXI.AnimatedSprite;
    private holdItem: FurnitureItem;

    constructor() {
        super();
        this.inventory.addSlots(18);
        this.inventory.addItem(Items.WOOD_AXE);
        this.inventory.addItem(Items.WOOD_HOE);
        this.inventory.addItem(Items.WOOD_PICKAXE);
        this.inventory.addItem(Items.WOOD_SHOVEL);
        this.inventory.addItem(Items.WOOD_SWORD);
        this.inventory.addItem(Items.FISHING_ROD);
    }

    public destroy(): void {
        return;
    }

    public canSwim(): boolean {
        return true;
    }

    public die(): void {
    }

    public onCommand() {
        let ax = 0;
        let ay = 0;

        if (Game.input.getKey("MOVE-RIGHT").down) ax += 3;
        if (Game.input.getKey("MOVE-LEFT").down) ax += -3;
        if (Game.input.getKey("MOVE-DOWN").down) ay += 3;
        if (Game.input.getKey("MOVE-UP").down) ay += -3;
        if (Game.input.getKey("JUMP").clicked && this.z === 0) this.a.z = 3;

        const levelTile = this.getInteractTile();
        if (Game.input.getKey("ATTACK").down) {
            const item = this.inventory.selectedItem();
            this.level.findEntitiesInRadius(
                () => true,
                (this.x >> 4) + this.dir.getX(),
                (this.y >> 4) + this.dir.getY(),
                1,
            ).then((entities) => {
                if (entities.length <= 0 && levelTile && item instanceof Item) {
                    item.useOn(levelTile, this);
                }
                this.attack(5);
                entities.forEach((e) => {
                    if (e instanceof Furniture) {
                        e.onUse(this, item);
                    }
                });
            });

        }

        if (this.aSpeed < this.speed) {
            this.a.x += ax / 5;
            this.a.y += ay / 5;
        }
    }

    public onTick(): void {
        super.onTick();
        if (!Game.GUI.isBlocking()) {
            this.onCommand();
        }
        const selectedItem = this.inventory.selectedItem();
        if (selectedItem instanceof FurnitureItem) {
            if (this.holdItem !== selectedItem) {
                this.holdItemContainer.removeChildren();
                this.holdItem = selectedItem as FurnitureItem;
                this.holdItemContainer.addChild(selectedItem.getFurnitureSprite());
            }
        } else {
            this.holdItem = undefined;
            this.holdItemContainer.removeChildren();
        }
    }

    public onRender() {
        super.onRender();
        const holdItem = this.inventory.selectedItem() instanceof FurnitureItem;
        if (Math.abs(this.a.get2dMagnitude()) > 0.1) {
            this.playAnimation("walk", holdItem ? "hold" : "normal");
        } else if (this.inventory.selectedItem() instanceof FishingRodItem) {
            this.playAnimation("fishing");
        } else {
            this.playAnimation("idle", holdItem ? "hold" : "normal");
        }

        const levelTile = this.getInteractTile();
        if (levelTile && this.targetTile) {
            this.targetTile.position.set(levelTile.x - this.x, levelTile.y - this.y);
        }
    }

    protected init() {
        super.init();
        this.sprite = new PIXI.AnimatedSprite([PIXI.Texture.EMPTY], true);
        this.sprite.anchor.set(0.5);
        this.targetTile = new PIXI.Sprite(PIXI.Texture.from(System.getResource("select.png")));
        this.targetTile.alpha = 0.7;
        this.holdItemContainer = new PIXI.Container();
        this.holdItemContainer.position.y = -14;
        this.container.addChild(this.sprite, this.holdItemContainer);
        this.addChildAt(this.targetTile, 0);
        this.playAnimation("walk");
    }

    protected steppedOn() {
        super.steppedOn();
    }

    private playAnimation(
        name: string, type: "normal" | "hold" = "normal", loop: boolean = true): PIXI.AnimatedSprite | undefined {
        const a = Player.spriteSheet.getAnimation(name, this.dir, type);
        if (!this.sprite || this.sprite.textures === a) return;
        this.sprite.textures = a;
        this.sprite.animationSpeed = 0.1;
        this.sprite.play();
        this.sprite.loop = loop;
        return this.sprite;
    }
}
