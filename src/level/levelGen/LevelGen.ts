import Seed from "../../utility/Seed";
import Level from "../Level";
import LevelTile from "../LevelTile";

export default abstract class LevelGen {

    public static create(seed: number | string = 0) {
        // @ts-ignore
        return new this(seed);
    }

    protected static chunkSize = 16;
    public seed = 0;

    protected constructor(seed: number | string = 0) {
        this.seed = Seed.create(seed);
    }

    public abstract genChunk(cX: number, cY: number, level?: Level, callback?: () => void): LevelTile[];
}