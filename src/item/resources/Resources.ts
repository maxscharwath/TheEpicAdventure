import System from "../../core/System";
import Resource from "./Resource";

export default class Resources {
    public static wheat = new Resource("wheat", System.getResource("items", "wheat.png"));
    public static seedWheat = new Resource("seedWheat", System.getResource("items", "seeds_wheat.png"));
    public static apple = new Resource("apple", System.getResource("items", "apple.png"));
}
