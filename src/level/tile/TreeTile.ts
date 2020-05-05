import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Tile from "./Tile";
import Tiles from "./Tiles";
import TileStates from "./TileStates";

export default class TreeTile extends Tile {
    protected states = TileStates.create({damage: 0});
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

        this.container.addChild(this.layersTreeSprite[0]);
        this.container.addChild(this.layersTreeSprite[1]);
        this.container.addChild(new PIXI.Sprite(new PIXI.Texture(texture)));
        this.container.addChild(this.layersTreeSprite[2]);
        this.container.addChild(this.layersTreeSprite[3]);
    }

    protected initTree() {
        this.setGroundTile(Tiles.GRASS.tile);
        this.treeTilingInit(System.getResource("tile", "tree.png"));
    }

    private layersTreeSprite: PIXI.Sprite[];

    private treeTiling() {
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return (t && t.tile?.constructor === this.constructor);
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

    public static readonly TAG: string = "tree";

    public init() {
        super.init();
        this.initTree();
    }

    public onTick(): void {
        super.onTick();
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
        this.states.damage += 1;
        if (this.states.damage >= 15) {
            this.levelTile.setTile(this.groundTile.getClass());
        }
        return true;
    }
}
