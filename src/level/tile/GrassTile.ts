import * as PIXI from "pixi.js";
import Tile from "./Tile";

export default class GrassTile extends Tile {
    protected updateMask() {
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return !(t && t.instanceOf(this.constructor));
        };
        const u = test(0, -1);
        const d = test(0, 1);
        const l = test(-1, 0);
        const r = test(1, 0);

        this.sprites[0].texture =  GrassTile.masks[(!u && !l) ? 4 : (u && l) ? 0 : (u) ? 1 : 3 ];
        this.sprites[1].texture =  GrassTile.masks[(!u && !r) ? 4 : (u && r) ? 2 : (u) ? 1 : 5 ];
        this.sprites[2].texture =  GrassTile.masks[(!d && !l) ? 4 : (d && l) ? 6 : (d) ? 7 : 3 ];
        this.sprites[3].texture =  GrassTile.masks[(!d && !r) ? 4 : (d && r) ? 8 : (d) ? 7 : 5 ];
    }
    protected init(): void {
        this.sprites = [ new PIXI.Sprite(), new PIXI.Sprite(), new PIXI.Sprite(), new PIXI.Sprite()];
        this.sprites[0].position.set(0, 0);
        this.sprites[1].position.set(8, 0);
        this.sprites[2].position.set(0, 8);
        this.sprites[3].position.set(8, 8);
        this.levelTile.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/grass.png")), ...this.sprites);
        this.updateMask();
    }
    private static masks = GrassTile.loadMaskTextures("src/resources/grass_mask.png");
    private sprites: PIXI.Sprite[];
    public static readonly TAG = "grass";

    public tick(): void {
        super.tick();
        this.updateMask();
    }

}
