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

export class TileRegister<T extends Tile> {
    protected constructor(idx: number, tag: string, tile: Type<T>) {
        this.tag = tag;
        this.tile = tile;
        this.idx = idx;
        TileRegister.tiles.add(this.idx, this.tag, this.tile);
        console.log(`adding ${this.tile.name} => ${this.tag}#${this.idx}`);
    }

    private static tiles = new KeyedMap<Type<Tile>>();

    public static add<T extends Tile>(idx: number, tag: string, tile: Type<T>) {
        return new TileRegister(idx, tag, tile);
    }

    public static get(index: string | number): Type<Tile> {
        const tileData = this.tiles.get(index);
        return (!tileData ? Tile : tileData) as Type<Tile>;
    }

    public static getSome(...tags: string[]): Array<Type<Tile>> {
        return this.tiles.getSome(...tags);
    }

    public static getKeys(tile: Type<Tile>): { idx: number; tag: string } {
        return this.tiles.getKeys(tile);
    }

    public readonly tag: string;
    public readonly tile: Type<T>;
    public readonly idx: number;
}

export default class Tiles extends TileRegister<Tile> {
    public static DIRT = Tiles.add(0, "dirt", DirtTile);
    public static GRASS = Tiles.add(1, "grass", GrassTile);
    public static WATER = Tiles.add(2, "water", WaterTile);
    public static LAVA = Tiles.add(3, "lava", LavaTile);
    public static LILYPAD = Tiles.add(4, "lilypad", LilyPadTile);
    public static SAND = Tiles.add(5, "sand", SandTile);
    public static ROCK = Tiles.add(6, "rock", RockTile);
    public static HOLE = Tiles.add(7, "hole", HoleTile);
    public static FARMLAND = Tiles.add(8, "farmland", FarmlandTile);
    public static WHEAT = Tiles.add(9, "wheat", WheatTile);
    public static TREE = Tiles.add(10, "tree", TreeTile);
    public static PALM = Tiles.add(11, "palm", PalmTreeTile);
    public static SPRUCE = Tiles.add(12, "spruce", SpruceTreeTile);
    public static CACTUS = Tiles.add(13, "cactus", CactusTile);
    public static SNOW = Tiles.add(14, "snow", SnowTile);
    public static ICE = Tiles.add(15, "ice", IceTile);

}
