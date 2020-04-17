import Entity from "../../entity/Entity";
import Tile from "./Tile";

export default class WaterTile extends Tile {
    public static readonly TAG = "water";

    public tick(): void {

    }

    public mayPass(e: Entity): boolean {
        return e.canSwim() || e.canFly();
    }

    protected init(): void {
    }

}
