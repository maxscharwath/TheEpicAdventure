import {Entity} from "../../entity";
import LevelTile from "../../level/LevelTile";
import Tile from "../../level/tile/Tile";
import {TileRegister} from "../../level/tile/Tiles";
import Resource from "./Resource";

type Type<T> = new (...args: any[]) => T;
export default class TileResource extends Resource {
    private readonly sourceTiles: Array<Type<Tile>> = [];
    private readonly targetTile: Type<Tile>;

    constructor(path: string, targetTile: TileRegister<Tile>, ...sourceTile: Array<TileRegister<Tile>>) {
        super(path);
        this.targetTile = targetTile.tile;
        this.sourceTiles = sourceTile.map((t) => t.tile);
    }

    public useOn(levelTile: LevelTile, entity: Entity): boolean {
        if (levelTile.instanceOf(...this.sourceTiles)) {
            levelTile.setTile(this.targetTile);
            return true;
        }
        return false;
    }
}