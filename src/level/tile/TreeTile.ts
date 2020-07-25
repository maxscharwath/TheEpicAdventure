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
import LeafParticle from "../../entity/particle/LeafParticle";
import Random from "../../utility/Random";
import RainWeather from "../../gfx/weather/RainWeather";

export default class TreeTile extends Tile {
    public static readonly TAG: string = "tree";
    public static readonly COLOR: number = 0x19a02a;
    public anchor = 1;
    protected damage = 0;
    protected wiggleDelay: number = 0;
    private treeSprite: PIXI.Sprite;
    private leafSprite: PIXI.Sprite;
    private leavesDropDelay: number = 0;

    public init() {
        super.init();
        this.initTree();
    }

    public onTick(): void {
        super.onTick();
        if (this.wiggleDelay > 0) this.wiggleDelay--;
        if (this.leavesDropDelay > 0) this.leavesDropDelay--;
    }

    public onRender() {
        super.onRender();

        if (this.level.weather instanceof RainWeather) {
            this.sortableContainer.angle = 20 + Math.sin((Renderer.ticks + this.x + this.y) / 5) * 5;
            this.leafSprite.angle = Math.sin((Renderer.ticks + this.x + this.y) / 5) * 10;
        }

        if (this.wiggleDelay > 0) {
            this.leafSprite.scale.set(
                1 + Math.sin(Renderer.ticks / 2) / 20,
                1 + Math.cos(Renderer.ticks / 2) / 20,
            );
        } else {
            this.leafSprite.scale.set(1, 1);
        }
    }

    public onUpdate() {
        super.onUpdate();
    }

    public mayPass(e: Entity): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        if (!item) {
            this.hurt(1);
        } else if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.axe:
                    const hurt = item.getAttackDamageBonus();
                    this.hurt(hurt);
                    return true;
            }
        }
        return false;
    }

    public bumpedInto(entity: Entity) {
        super.bumpedInto(entity);
        this.leavesDrop();
    }

    protected onDestroy() {
        super.onDestroy();
        this.setTileToGround();
        this.addItemEntity(Items.WOOD);
        this.addItemEntity(Items.STICK, [0, 2]);
    }

    protected treeTilingInit(source: string) {
        const texture = PIXI.BaseTexture.from(source);
        this.treeSprite = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(32, 0, 32, 32)));
        this.leafSprite = new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 32, 32)));
        this.offset.set(
            this.random.int(-4, 4),
            this.random.int(-4, 4),
        );
        this.sortableContainer.pivot.set(8, 16);
        this.sortableContainer.position.set(8 + this.offset.x, 16 + this.offset.y);
        this.treeSprite.anchor.set(0.5, 1);
        this.treeSprite.position.set(8, 16);
        this.leafSprite.anchor.set(0.5, 0.5);
        this.leafSprite.position.set(8, 0);
        this.sortableContainer.addChild(this.treeSprite, this.leafSprite);
    }

    protected initTree() {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "tree.png"));
    }

    private hurt(dmg: number) {
        const x = this.levelTile.x + 8 + this.offset.x;
        const y = this.levelTile.y + 8 + this.offset.y;
        this.damage += dmg;
        this.wiggleDelay = 10;
        this.leavesDrop();
        this.levelTile.level.add(
            new DamageParticle(x, y, -dmg, 0xc80000),
        );
        this.levelTile.level.add(new HurtParticle(x, y));
        if (this.damage >= 15) {
            this.onDestroy();
        }
    }

    private leavesDrop() {
        if (this.leavesDropDelay > 0) return;
        this.leavesDropDelay = 20;
        this.wiggleDelay = 10;
        for (let i = 0; i < Random.int(5, 20); i++) {
            this.level.add(new LeafParticle(
                (this.x << 4) + this.offset.x + Random.int(16),
                (this.y << 4) + this.offset.y + Random.int(16),
            ));
        }
    }
}
