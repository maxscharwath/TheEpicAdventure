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
import PlankTile from "./PlankTile";
import BirchTreeTile from "./BirchTreeTile";
import AcaciaTreeTile from "./AcaciaTreeTile";
import PotatoTile from "./PotatoTile";
import DarkGrassTile from "./DarkGrassTile";
import RailTile from "./RailTile";
import BushTile from "./BushTile";
import FlowerTile from "./FlowerTile";
import StoneTile from "./StoneTile";
import MushroomTile from "./MushroomTile";
import CarrotTile from "./CarrotTile";
import CornTile from "./CornTile";

export class TileRegister<T extends typeof Tile> {

    public static add<T extends typeof Tile>(idx: number, tag: string, tile: T) {
        return new TileRegister(idx, tag, tile);
    }

    public static get(index: string | number) {
        const tileData = this.tiles.get(index);
        return (!tileData ? Tile : tileData);
    }

    public static getSome(...tags: string[]) {
        return this.tiles.getSome(...tags);
    }

    public static getKeys(tile: typeof Tile): { tag: string | undefined; idx: number | undefined } {
        return this.tiles.getKeys(tile);
    }

    private static tiles = new KeyedMap<typeof Tile>();
    public readonly tag: string;
    public readonly tile: T;
    public readonly idx: number;

    protected constructor(idx: number, tag: string, tile: T) {
        this.tag = tag;
        this.tile = tile;
        this.idx = idx;
        TileRegister.tiles.add(this.idx, this.tag, this.tile);
        console.log(`adding ${this.tile.name} => ${this.tag}#${this.idx}`);
    }

    public getClass(): T {
        return this.tile;
    }
}

export default class Tiles extends TileRegister<typeof Tile> {
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
    public static POTATO = Tiles.add(10, "potato", PotatoTile);
    public static CARROT = Tiles.add(11, "carrot", CarrotTile);
    public static CORN = Tiles.add(12, "corn", CornTile);
    public static TREE = Tiles.add(13, "tree", TreeTile);
    public static BIRCH = Tiles.add(14, "birch", BirchTreeTile);
    public static PALM = Tiles.add(15, "palm", PalmTreeTile);
    public static SPRUCE = Tiles.add(16, "spruce", SpruceTreeTile);
    public static ACACIA = Tiles.add(17, "acacia", AcaciaTreeTile);
    public static CACTUS = Tiles.add(18, "cactus", CactusTile);
    public static SNOW = Tiles.add(19, "snow", SnowTile);
    public static ICE = Tiles.add(20, "ice", IceTile);
    public static PLANK = Tiles.add(21, "plank", PlankTile);
    public static DARK_GRASS = Tiles.add(22, "dark_grass", DarkGrassTile);
    public static RAIL = Tiles.add(23, "rail", RailTile);
    public static BUSH = Tiles.add(24, "bush", BushTile);
    public static FLOWER = Tiles.add(25, "flower", FlowerTile);
    public static STONE = Tiles.add(26, "stone", StoneTile);
    public static MUSHROOM = Tiles.add(27, "mushroom", MushroomTile);

}
