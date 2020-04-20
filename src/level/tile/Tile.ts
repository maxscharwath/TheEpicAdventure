import Localization from "../../core/io/Localization";
import Entity from "../../entity/Entity";
import Random from "../../utility/Random";
import LevelTile from "../LevelTile";

type Type<T> = new (...args: any[]) => T;
export default class Tile {

    protected random: Random = new Random();
    protected levelTile: LevelTile;

    public static SIZE = 16;
    public static readonly TAG: string = "tile";
    public groundTile?: Tile;

    public ["constructor"]: typeof Tile;

    public light: number = 1;
    public maySpawn: boolean = false;
    public friction: number = 0.1;

    constructor(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.init();
    }

    public init() {

    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public steppedOn(entity: Entity) {
    }

    public tick(): void {
    }

    public render(): void {
    }

    public toJSON() {
        return this.constructor.TAG;
    }

    public getDisplayName(): string {
        return Localization.get(`tile.${this.constructor.TAG}`);
    }

    public setLevelTile(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.init();
        return this;
    }

    public instanceOf(...tileClass: Array<Type<Tile>>) {
        const ground = this.groundTile;
        return tileClass.some((c) => this instanceof c || ground instanceof c);
    }
}
