import * as PIXI from "pixi.js";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class FarmlandTile extends Tile {
    private humidity: number = 0;
    private filter: PIXI.filters.ColorMatrixFilter;
    public static readonly TAG = "farmland";

    public init() {
        super.init();
        this.filter = new PIXI.filters.ColorMatrixFilter();
        this.container.filters = [this.filter];
        this.container.addChild(new PIXI.Sprite(PIXI.Texture.from("src/resources/farmland.png")));
    }

    public onTick(): void {
        super.onTick();
        if (this.random.probability(100)) {
            if (!this.levelTile.findTileRadius(3, Tiles.get("water"))) {
                --this.humidity;
                this.filter.brightness(this.humidity / -50 + 1, false);
                if (this.humidity <= -10) {
                    return this.levelTile.setTile(Tiles.get("dirt"));
                }
            } else {
                if (this.humidity < 10) {
                    ++this.humidity;
                    this.filter.brightness(this.humidity / -50 + 1, false);
                }
            }
        }
    }

}
