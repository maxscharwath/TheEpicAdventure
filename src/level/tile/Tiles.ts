import KeyedMap from "../../utility/KeyedMap";
import CactusTile from "./CactusTile";
import DirtTile from "./DirtTile";
import FarmlandTile from "./FarmlandTile";
import GrassTile from "./GrassTile";
import HoleTile from "./HoleTile";
import IceTile from "./IceTile";
import LavaTile from "./LavaTile";
import LilyPadTile from "./LilyPadTile";
import PalmTreeTile from "./PalmTreeTile";
import RockTile from "./RockTile";
import SandTile from "./SandTile";
import SnowTile from "./SnowTile";
import SpruceTreeTile from "./SpruceTreeTile";
import Tile from "./Tile";
import TreeTile from "./TreeTile";
import WaterTile from "./WaterTile";
import WheatTile from "./WheatTile";

type Type<T> = new (...args: any[]) => T;

interface TileRegister<T> {
    idx: number;
    tag: string;
    tile: Type<T>;
}

export default class Tiles {

    private static tiles = new KeyedMap<Type<Tile>>();

    private static registerTile<T>(idx: number, tag: string, tile: Type<T>): TileRegister<T> {
        const tileRegister = {
            idx,
            tag,
            tile,
        };
        this.add(tileRegister);
        return tileRegister;
    }

    private static add({idx, tag, tile}: TileRegister<any>): void {
        tag = tag.toLowerCase();
        if (this.tiles.add(idx, tag, tile)) {
            console.log(`adding ${tile.name} => ${tag}#${idx}`);
        } else {
            throw new Error(`tag: ${tag}#${idx} already exist.`);
        }
    }

    public static DIRT = Tiles.registerTile(0, "dirt", DirtTile);
    public static GRASS = Tiles.registerTile(1, "grass", GrassTile);
    public static WATER = Tiles.registerTile(2, "water", WaterTile);
    public static LAVA = Tiles.registerTile(3, "lava", LavaTile);
    public static LILYPAD = Tiles.registerTile(4, "lilypad", LilyPadTile);
    public static SAND = Tiles.registerTile(5, "sand", SandTile);
    public static ROCK = Tiles.registerTile(6, "rock", RockTile);
    public static HOLE = Tiles.registerTile(7, "hole", HoleTile);
    public static FARMLAND = Tiles.registerTile(8, "farmland", FarmlandTile);
    public static WHEAT = Tiles.registerTile(9, "wheat", WheatTile);
    public static TREE = Tiles.registerTile(10, "tree", TreeTile);
    public static PALM = Tiles.registerTile(11, "palm", PalmTreeTile);
    public static SPRUCE = Tiles.registerTile(12, "spruce", SpruceTreeTile);
    public static CACTUS = Tiles.registerTile(13, "cactus", CactusTile);
    public static SNOW = Tiles.registerTile(14, "snow", SnowTile);
    public static ICE = Tiles.registerTile(15, "ice", IceTile);

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

}
