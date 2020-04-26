import * as PIXI from "pixi.js";
import Random from "../../utility/Random";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class FarmlandTile extends Tile {
    protected humidity: number = 0;

    protected growthRate(initProb: number): boolean {
        const bonus = 1 + (this.humidity) / 10;
        if (bonus <= 0) {
            return false;
        }
        return Random.probability(initProb / bonus);
    }

    protected harvest() {

    }

    private filter: PIXI.filters.ColorMatrixFilter;
    public static readonly TAG: string = "farmland";

    public init() {
        super.init();
        this.filter = new PIXI.filters.ColorMatrixFilter();
        const sprite = new PIXI.Sprite(PIXI.Texture.from("src/resources/farmland.png"));
        sprite.filters = [this.filter];
        this.container.addChild(sprite);
    }

    public onTick(): void {
        super.onTick();
        if (Random.probability(50)) {
            if (!this.levelTile.findTileRadius(3, Tiles.get("water"))) {
                if (this.humidity > -10 && Random.probability(5)) {
                    --this.humidity;
                    this.filter.brightness(this.humidity / -40 + 1, false);
                }
            } else {
                if (this.humidity < 10) {
                    ++this.humidity;
                    this.filter.brightness(this.humidity / -40 + 1, false);
                }
            }
            if (this.humidity <= -10 && Random.probability(25)) {
                this.levelTile.setTile(Tiles.get("dirt"));
                this.harvest();
                return;
            }
        }
    }
}
