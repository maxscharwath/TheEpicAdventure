import Tiles from "../../level/tile/Tiles";
import FarmResource from "./FarmResource";
import Resource from "./Resource";
import TileResource from "./TileResource";

export default class Resources {
    public static wheat = new Resource("wheat.png");
    public static bread = new Resource("bread.png");
    public static seedWheat = new FarmResource("seeds_wheat.png", Tiles.WHEAT);
    public static potato = new FarmResource("potato.png", Tiles.POTATO);
    public static apple = new Resource("apple.png");
    public static sand = new TileResource("sand.png", Tiles.SAND, Tiles.HOLE, Tiles.WATER);
    public static dirt = new TileResource("dirt.png", Tiles.DIRT, Tiles.HOLE, Tiles.WATER);
    public static ice = new TileResource("ice.png", Tiles.ICE, Tiles.WATER);
    public static lilypad = new TileResource("lilypad.png", Tiles.LILYPAD, Tiles.WATER);
    public static stone = new Resource("stone.png");
    public static iron = new Resource("iron.png");
    public static gold = new Resource("gold.png");
    public static diamond = new Resource("diamond.png");
    public static snowball = new Resource("snowball.png");
    public static stick = new Resource("stick.png");
    public static fish = new Resource("fish_salmon_raw.png");
    public static flask = new Resource("potion.png");
    public static wood = new TileResource("wood.png", Tiles.PLANK, Tiles.HOLE);
    public static cactusFlower = new TileResource("cactus_flower.png", Tiles.CACTUS, Tiles.SAND);
    public static rail = new TileResource("rail.png", Tiles.RAIL, Tiles.GRASS, Tiles.DIRT, Tiles.SAND);
}
