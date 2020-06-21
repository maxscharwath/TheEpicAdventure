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

export default class TreeTile extends Tile {
    public static readonly TAG: string = "tree";
    protected damage = 0;
    protected hurtDelay: number = 0;
    private layersTreeSprite: PIXI.Sprite[] = [];
    private treeSprite: PIXI.Sprite;

    public init() {
        super.init();
        this.initTree();
    }

    public onTick(): void {
        super.onTick();
        if (this.hurtDelay > 0) {
            this.hurtDelay--;
            this.treeSprite.scale.set(
                1 + Math.sin(this.hurtDelay) / 10,
                1 + Math.cos(this.hurtDelay) / 10,
            );
        } else {
            this.treeSprite.scale.set(1, 1);
        }
    }

    public onRender() {
        super.onRender();
    }

    public onUpdate() {
        super.onUpdate();
        this.treeTiling();
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
                    this.hurtDelay = 10;
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
        this.layersTreeSprite = [
            new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(8, 8, 8, 8))),
            new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(0, 8, 8, 8))),
            new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(8, 0, 8, 8))),
            new PIXI.Sprite(new PIXI.Texture(texture, new PIXI.Rectangle(0, 0, 8, 8))),
        ];

        this.layersTreeSprite[0].position.set(0, 0);
        this.layersTreeSprite[1].position.set(8, 0);
        this.layersTreeSprite[2].position.set(0, 8);
        this.layersTreeSprite[3].position.set(8, 8);

        this.layersTreeSprite[0].visible = false;
        this.layersTreeSprite[1].visible = false;
        this.layersTreeSprite[2].visible = false;
        this.layersTreeSprite[3].visible = false;

        this.treeSprite = new PIXI.Sprite(new PIXI.Texture(texture));

        this.container.addChild(this.layersTreeSprite[0]);
        this.container.addChild(this.layersTreeSprite[1]);
        this.container.addChild(this.treeSprite);
        this.container.addChild(this.layersTreeSprite[2]);
        this.container.addChild(this.layersTreeSprite[3]);
        this.treeSprite.anchor.set(0.5);
        this.treeSprite.position.set(8, 8);
    }

    protected initTree() {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "tree.png"));
    }

    private treeTiling() {
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return Boolean(t && (t.tile?.constructor === this.constructor));
        };
        const u = test(0, -1);
        const d = test(0, 1);
        const l = test(-1, 0);
        const r = test(1, 0);

        const ul = test(-1, -1);
        const ur = test(1, -1);
        const dl = test(-1, 1);
        const dr = test(1, 1);
        this.layersTreeSprite[0].visible = (u && ul && l);
        this.layersTreeSprite[1].visible = (u && ur && r);
        this.layersTreeSprite[2].visible = (d && dl && l);
        this.layersTreeSprite[3].visible = (d && dr && r);
    }
}
