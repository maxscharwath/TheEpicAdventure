import Seed from "../../utility/Seed";
import Level from "../Level";
import LevelTile from "../LevelTile";

export default abstract class LevelGen {

    protected static chunkSize = 16;

    protected constructor(seed: number | string = 0) {
        this.seed = Seed.create(seed);
    }

    public static create(seed: number | string = 0) {
        // @ts-ignore
        return new this(seed);
    }
    public seed = 0;

    public abstract genChunk(cX: number, cY: number, level?: Level, callback?: () => void): Array<LevelTile>;
}
