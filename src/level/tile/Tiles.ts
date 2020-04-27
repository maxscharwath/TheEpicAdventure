import KeyedMap from "../../utility/KeyedMap";
import CactusTile from "./CactusTile";
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
import WheatTile from "./WheatTile";

type Type<T> = new (...args: any[]) => T;

export default class Tiles {

    private static tiles = new KeyedMap<Type<Tile>>();

    public static add(idx: number, tag: string, tile: Type<Tile>): void {
        tag = tag.toLowerCase();
        if (this.tiles.add(idx, tag, tile)) {
            console.log(`adding ${tile.name} => ${tag}#${idx}`);
        } else {
            throw new Error(`tag: ${tag}#${idx} already exist.`);
        }
    }

    public static get(index: string | number): Type<Tile> {
        const tileData = this.tiles.get(index);
        return !tileData ? Tile : tileData;
    }

    public static getSome(...tags: string[]): Array<Type<Tile>> {
        return this.tiles.getSome(...tags);
    }

    public static getKeys(tile: Type<Tile>): { idx: number; tag: string } {
        return this.tiles.getKeys(tile);
    }

    public static initTileList() {
        Tiles.add(0, "dirt", DirtTile);
        Tiles.add(1, "grass", GrassTile);
        Tiles.add(2, "water", WaterTile);
        Tiles.add(3, "lava", LavaTile);
        Tiles.add(4, "lilypad", LilyPadTile);
        Tiles.add(5, "sand", SandTile);
        Tiles.add(6, "rock", RockTile);
        Tiles.add(7, "hole", HoleTile);
        Tiles.add(8, "farmland", FarmlandTile);
        Tiles.add(9, "wheat", WheatTile);
        Tiles.add(10, "tree", TreeTile);
        Tiles.add(11, "palm", PalmTreeTile);
        Tiles.add(12, "spruce", SpruceTreeTile);
        Tiles.add(13, "cactus", CactusTile);
    }
}
