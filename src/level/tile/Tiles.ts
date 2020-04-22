import DirtTile from "./DirtTile";
import FarmlandTile from "./FarmlandTile";
import GrassTile from "./GrassTile";
import HoleTile from "./HoleTile";
import LavaTile from "./LavaTile";
import LilyPadTile from "./LilyPadTile";
import PalmTreeTile from "./PalmTreeTile";
import RockTile from "./RockTile";
import SandTile from "./SandTile";
import SpruceTreeTile from "./SpruceTreeTile";
import Tile from "./Tile";
import TreeTile from "./TreeTile";
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

    public static getSome(...tags: string[]): Array<Type<Tile>> {
        const results: Array<Type<Tile>> = [];
        tags.forEach((tag) => {
            tag = tag.toLowerCase();
            if (!this.tiles.has(tag)) {
                return;
            }
            results.push(this.tiles.get(tag));
        });
        return results;
    }

    public static initTileList() {
        Tiles.add("grass", GrassTile);
        Tiles.add("water", WaterTile);
        Tiles.add("lava", LavaTile);
        Tiles.add("lilypad", LilyPadTile);
        Tiles.add("sand", SandTile);
        Tiles.add("rock", RockTile);
        Tiles.add("hole", HoleTile);
        Tiles.add("dirt", DirtTile);
        Tiles.add("farmland", FarmlandTile);
        Tiles.add("tree", TreeTile);
        Tiles.add("palm", PalmTreeTile);
        Tiles.add("spruce", SpruceTreeTile);
    }
}
