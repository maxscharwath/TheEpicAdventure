import {Entity} from "../../entity";
import LevelTile from "../../level/LevelTile";
import Tile from "../../level/tile/Tile";
import Tiles, {TileRegister} from "../../level/tile/Tiles";
import Resource from "./Resource";

type Type<T> = new (...args: any[]) => T;
export default class FarmResource extends Resource {
    private readonly targetTile: Type<Tile>;

    constructor(path: string, targetTile: TileRegister<Tile>) {
        super(path);
        this.targetTile = targetTile.tile;
    }

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        if (levelTile.is(Tiles.FARMLAND.tile)) {
            levelTile.setTile(this.targetTile);
            return true;
        }
        return false;
    }
}
