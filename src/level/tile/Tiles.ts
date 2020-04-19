import GrassTile from "./GrassTile";
import RockTile from "./RockTile";
import SandTile from "./SandTile";
import Tile from "./Tile";
import WaterTile from "./WaterTile";

type Type<T> = new (...args: any[]) => T;
export default class Tiles {

    private static tiles = new Map<string, Type<Tile>>();

    public static add(tag: string, tile: Type<Tile>): void {
        tag = tag.toLowerCase();
        console.log("adding " + tile.name + " to tile list with tag " + tag);
        Tiles.tiles.set(tag, tile);
    }

    public static get(tag: string): Type<Tile> {
        tag = tag.toLowerCase();
        if (!this.tiles.has(tag)) {
            return Tile;
        }
        return this.tiles.get(tag);
    }

    public static initTileList() {
        Tiles.add("grass", GrassTile);
        Tiles.add("water", WaterTile);
        Tiles.add("lava", Tile);
        Tiles.add("sand", SandTile);
        Tiles.add("rock", RockTile);
    }
}
