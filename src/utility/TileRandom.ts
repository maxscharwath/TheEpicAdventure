import LevelTile from "../level/LevelTile";
import Random from "./Random";

export default class TileRandom extends Random {
    private levelTile: LevelTile;

    constructor(levelTile: LevelTile) {
        super();
        this.levelTile = levelTile;
    }

    public random() {
        const x = Math.sin(this.levelTile.getLocalX() * this.levelTile.getLocalY()) * 10000;
        return x - Math.floor(x);
    }
}
