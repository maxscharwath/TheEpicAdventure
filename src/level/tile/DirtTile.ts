import * as PIXI from "pixi.js";
import Random from "../../utility/Random";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class DirtTile extends Tile {
    private static tileTextures = DirtTile.loadTextures("src/resources/dirt.png", 4);
    public static readonly TAG = "dirt";
    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(DirtTile.tileTextures[this.random.int(DirtTile.tileTextures.length)]),
        );
    }

    public onTick(): void {
        super.onTick();
        if (!this.levelTile.biome.is("savanna") && Random.probability(500)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.get("grass")))) {
                this.levelTile.setTile(Tiles.get("grass"));
            }
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.get("sand")))) {
                this.levelTile.setTile(Tiles.get("sand"));
            }
        }
    }

}
