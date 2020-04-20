import * as PIXI from "pixi.js";
import Entity from "../../entity/Entity";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class TreeTile extends Tile {

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

        this.levelTile.addChild(this.layersTreeSprite[0]);
        this.levelTile.addChild(this.layersTreeSprite[1]);
        this.levelTile.addChild(new PIXI.Sprite(new PIXI.Texture(texture)));
        this.levelTile.addChild(this.layersTreeSprite[2]);
        this.levelTile.addChild(this.layersTreeSprite[3]);
    }

    private layersTreeSprite: PIXI.Sprite[];

    private treeTiling() {
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return (t && t.tile.constructor === this.constructor);
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

    public init() {
        super.init();
        this.groundTile = new (Tiles.get("grass"))(this.levelTile);
        this.groundTile.init();
        this.treeTilingInit("src/resources/tree.png");
    }

    public tick(): void {
        super.tick();
        this.groundTile.tick();
        this.treeTiling();
    }

    public mayPass(e: Entity): boolean {
        return false;
    }
}
