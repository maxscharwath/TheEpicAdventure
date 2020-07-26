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
import SugarCaneTile from "./SugarCaneTile";
import FenceTile from "./FenceTile";
import FenceGateTile from "./FenceGateTile";

export class TileRegister<T extends typeof Tile> {

    protected constructor(idx: number, tag: string, tile: T) {
        this.tag = tag;
        this.tile = tile;
        this.idx = idx;
        TileRegister.tiles.add(this.idx, this.tag, this.tile);
        console.log(`adding ${this.tile.name} => ${this.tag}#${this.idx}`);
    }
    public readonly idx: number;
    public readonly tag: string;
    public readonly tile: T;

    private static tiles = new KeyedMap<typeof Tile>();

    public static add<T extends typeof Tile>(idx: number, tag: string, tile: T): TileRegister<T> {
        return new TileRegister(idx, tag, tile);
    }

    public static get(index: string | number) :typeof Tile{
        const tileData = this.tiles.get(index);
        return (!tileData ? Tile : tileData);
    }

    public static getKeys(tile: typeof Tile): { idx: number | undefined, tag: string | undefined } {
        return this.tiles.getKeys(tile);
    }

    public static getSome(...tags: string[]): Array<typeof Tile> {
        return this.tiles.getSome(...tags);
    }

    public getClass(): T {
        return this.tile;
    }
}

export default class Tiles extends TileRegister<typeof Tile> {
    public static ACACIA = Tiles.add(17, "acacia", AcaciaTreeTile);
    public static BIRCH = Tiles.add(14, "birch", BirchTreeTile);
    public static BUSH = Tiles.add(24, "bush", BushTile);
    public static CACTUS = Tiles.add(18, "cactus", CactusTile);
    public static CARROT = Tiles.add(11, "carrot", CarrotTile);
    public static CORN = Tiles.add(12, "corn", CornTile);
    public static DARK_GRASS = Tiles.add(22, "dark_grass", DarkGrassTile);
    public static DIRT = Tiles.add(0, "dirt", DirtTile);
    public static FARMLAND = Tiles.add(8, "farmland", FarmlandTile);
    public static FENCE = Tiles.add(29, "fence", FenceTile);
    public static FENCE_GATE = Tiles.add(30, "fence_gate", FenceGateTile);
    public static FLOWER = Tiles.add(25, "flower", FlowerTile);
    public static GRASS = Tiles.add(1, "grass", GrassTile);
    public static HOLE = Tiles.add(7, "hole", HoleTile);
    public static ICE = Tiles.add(20, "ice", IceTile);
    public static LAVA = Tiles.add(3, "lava", LavaTile);
    public static LILYPAD = Tiles.add(4, "lilypad", LilyPadTile);
    public static MUSHROOM = Tiles.add(27, "mushroom", MushroomTile);
    public static PALM = Tiles.add(15, "palm", PalmTreeTile);
    public static PLANK = Tiles.add(21, "plank", PlankTile);
    public static POTATO = Tiles.add(10, "potato", PotatoTile);
    public static RAIL = Tiles.add(23, "rail", RailTile);
    public static ROCK = Tiles.add(6, "rock", RockTile);
    public static SAND = Tiles.add(5, "sand", SandTile);
    public static SNOW = Tiles.add(19, "snow", SnowTile);
    public static SPRUCE = Tiles.add(16, "spruce", SpruceTreeTile);
    public static STONE = Tiles.add(26, "stone", StoneTile);
    public static SUGAR_CANE = Tiles.add(28, "sugar_cane", SugarCaneTile);
    public static TREE = Tiles.add(13, "tree", TreeTile);
    public static WATER = Tiles.add(2, "water", WaterTile);
    public static WHEAT = Tiles.add(9, "wheat", WheatTile);

}
