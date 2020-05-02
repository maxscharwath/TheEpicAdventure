import * as PIXI from "pixi.js";
import System from "../../core/System";
import Random from "../../utility/Random";
import Tile from "./Tile";
import Tiles from "./Tiles";

export default class DirtTile extends Tile {
    private static tileTextures = DirtTile.loadTextures(System.getResource("dirt.png"), 4);
    public static readonly TAG = "dirt";
    public init() {
        super.init();
        this.container.addChild(
            new PIXI.Sprite(DirtTile.tileTextures[this.random.int(DirtTile.tileTextures.length)]),
        );
    }

    public onTick(): void {
        super.onTick();
        if (this.levelTile.biome.is("grassland") && Random.probability(500)) {
            const n = this.levelTile.getDirectNeighbourTiles(false);
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.get("grass")))) {
                this.levelTile.setTile(Tiles.GRASS.tile);
            }
            if (n.some((l) => !l.skipTick && l.instanceOf(Tiles.SAND.tile))) {
                this.levelTile.setTile(Tiles.SAND.tile);
            }
        }
    }

}
