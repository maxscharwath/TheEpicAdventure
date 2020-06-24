import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import Tile from "./Tile";
import Tiles from "./Tiles";
import DamageParticle from "../../entity/particle/DamageParticle";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import HurtParticle from "../../entity/particle/HurtParticle";
import Renderer from "../../core/Renderer";

export default class TreeTile extends Tile {
    public static readonly TAG: string = "tree";
    public anchor = 1;
    protected damage = 0;
    protected wiggleDelay: number = 0;
    private treeSprite: PIXI.Sprite;

    public init() {
        super.init();
        this.initTree();
    }

    public onTick(): void {
        super.onTick();
        if (this.wiggleDelay > 0) this.wiggleDelay--;
    }

    public onRender() {
        super.onRender();
        if (this.wiggleDelay > 0) {
            this.treeSprite.scale.set(
                1 + Math.sin(Renderer.ticks / 2) / 20,
                1 + Math.cos(Renderer.ticks / 2) / 20,
            );
        } else {
            this.treeSprite.scale.set(1, 1);
        }
    }

    public onUpdate() {
        super.onUpdate();
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.axe:
                    const hurt = item.getAttackDamageBonus();
                    this.damage += hurt;
                    this.wiggleDelay = 10;
                    this.levelTile.level.add(
                        new DamageParticle(this.levelTile.x + 8, this.levelTile.y + 8, -hurt, 0xc80000),
                    );
                    this.levelTile.level.add(new HurtParticle(this.levelTile.x + 8, this.levelTile.y + 8));
                    if (this.damage >= 15) {
                        if (this.groundTile) this.levelTile.setTile(this.groundTile.getClass());
                        this.addItemEntity(Items.WOOD);
                        this.addItemEntity(Items.STICK, 2);
                    }
                    return true;
            }
        }
        return false;
    }

    protected treeTilingInit(source: string) {
        const texture = PIXI.BaseTexture.from(source);
        this.treeSprite = new PIXI.Sprite(new PIXI.Texture(texture));
        this.sortableContainer.addChild(this.treeSprite);
        this.treeSprite.anchor.set(0.5, 1);
        this.treeSprite.position.set(8, 16);
    }

    protected initTree() {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "tree.png"));
    }
}
