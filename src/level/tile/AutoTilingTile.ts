import * as PIXI from "pixi.js";
import Tile from "./Tile";
import Tiles from "./Tiles";
export default class AutoTilingTile extends Tile {

    protected static canConnectTo: string[] = [];
    protected static autoTileTextures = AutoTilingTile.loadMaskTextures("src/resources/water.png");

    protected static loadMaskTextures(path: string): PIXI.Texture[] {
        const textures = [];
        const baseTexture = PIXI.BaseTexture.from(path);
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                textures.push(new PIXI.Texture(baseTexture, new PIXI.Rectangle(x * 8, y * 8, 8, 8)));
            }
        }
        return textures;
    }

    protected autoTiling() {
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return !(t && t.instanceOf(...[this.constructor, ...Tiles.getSome(...this.constructor.canConnectTo)]));
        };
        const u = test(0, -1);
        const d = test(0, 1);
        const l = test(-1, 0);
        const r = test(1, 0);

        this.sprites[0].texture =  this.constructor.autoTileTextures[(!u && !l) ? 4 : (u && l) ? 0 : (u) ? 1 : 3 ];
        this.sprites[1].texture =  this.constructor.autoTileTextures[(!u && !r) ? 4 : (u && r) ? 2 : (u) ? 1 : 5 ];
        this.sprites[2].texture =  this.constructor.autoTileTextures[(!d && !l) ? 4 : (d && l) ? 6 : (d) ? 7 : 3 ];
        this.sprites[3].texture =  this.constructor.autoTileTextures[(!d && !r) ? 4 : (d && r) ? 8 : (d) ? 7 : 5 ];
    }

    protected initAutoTile() {
        this.sprites = [ new PIXI.Sprite(), new PIXI.Sprite(), new PIXI.Sprite(), new PIXI.Sprite()];
        this.sprites[0].position.set(0, 0);
        this.sprites[1].position.set(8, 0);
        this.sprites[2].position.set(0, 8);
        this.sprites[3].position.set(8, 8);
        this.levelTile.addChild(...this.sprites);
        this.autoTiling();
    }
    private sprites: PIXI.Sprite[];
    public ["constructor"]: typeof AutoTilingTile;

    public tick(): void {
        super.tick();
        this.autoTiling();
    }
}
