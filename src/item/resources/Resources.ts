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
    public static ice = new TileResource("ice.png", Tiles.ICE, Tiles.WATER);
    public static lilypad = new TileResource("lilypad.png", Tiles.LILYPAD, Tiles.WATER);
    public static stone = new Resource("stone.png");
    public static snowball = new Resource("snowball.png");
    public static stick = new Resource("stick.png");
    public static wood = new Resource("wood.png");
    public static cactusFlower = new Resource("cactus_flower.png");
}
