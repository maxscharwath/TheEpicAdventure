import Tiles from "../../level/tile/Tiles";
import FarmResource from "./FarmResource";
import Resource from "./Resource";
import TileResource from "./TileResource";

export default class Resources {
    public static wheat = new Resource("wheat.png");
    public static seedWheat = new FarmResource("seeds_wheat.png", Tiles.WHEAT);
    public static apple = new Resource("apple.png");
    public static sand = new TileResource("sand.png", Tiles.SAND, Tiles.HOLE, Tiles.WATER);
    public static dirt = new TileResource("dirt.png", Tiles.DIRT, Tiles.HOLE, Tiles.WATER);
    public static snowball = new Resource("snowball.png");
}
