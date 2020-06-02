import * as PIXI from "pixi.js";
import Localization from "../../core/io/Localization";
import {ItemEntity, Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import {ItemRegister} from "../../item/Items";
import Random from "../../utility/Random";
import LevelTile from "../LevelTile";
import TileStates from "./TileStates";
import Tiles from "./Tiles";

type Type<T> = new (...args: any[]) => T;
export default abstract class Tile {

    protected get level() {
        return this.levelTile.level;
    }

    protected get x() {
        return this.levelTile.getLocalX();
    }

    protected get y() {
        return this.levelTile.getLocalY();
    }

    public static DEFAULT_STATES = {};
    public static SIZE = 16;
    public static readonly TAG: string = "tile";

    protected static loadTextures(path: string, nb: number): PIXI.Texture[] {
        const bt = PIXI.BaseTexture.from(path);
        const textures = [];
        for (let x = 0; x < nb; x++) {
            textures.push(new PIXI.Texture(bt, new PIXI.Rectangle(x * 16, 0, 16, 16)));
        }
        return textures;
    }
    public states = TileStates.create();
    public isInit: boolean = false;
    public container = new PIXI.Container();
    public ["constructor"]: typeof Tile;
    public light: number = 1;
    public maySpawn: boolean = false;
    public friction: number = 0.1;
    protected random: Random;
    protected levelTile: LevelTile;
    protected groundTile?: Tile;
    protected groundContainer = new PIXI.Container();

    constructor(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.random = levelTile.random;
        this.container.addChild(this.groundContainer);
    }

    public getClass() {
        return Object.getPrototypeOf(this).constructor;
    }

    public setGroundTile(tile: typeof Tile | Tile): Tile {
        if (tile instanceof Tile) {
            if (this.groundTile?.instanceOf(tile.getClass()))return;
            this.groundTile = tile;
        } else {
            if (this.groundTile?.instanceOf(tile))return;
            // @ts-ignore
            this.groundTile = new tile(this.levelTile);
        }
        this.groundContainer.removeChildren();
        this.levelTile.update();
        this.groundTile.init();
        this.groundContainer.addChild(this.groundTile.container);
        return this.groundTile;
    }

    public init() {
        this.isInit = true;
    }

    public mayPass(e: Entity): boolean {
        return true;
    }

    public steppedOn(entity: Entity) {
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        return false;
    }

    public onTick(): void {
        if (this.groundTile) {
            this.groundTile.onTick();
        }
    }

    public onRender() {
        if (this.groundTile) {
            this.groundTile.onRender();
        }
    }

    public onUpdate() {
        if (this.groundTile) {
            this.groundTile.onUpdate();
        }
    }

    public onSetTile(oldTile: Tile, entity?: Entity) {
    }

    public getDisplayName(): string {
        return Localization.get(`tile.${this.constructor.TAG}`);
    }

    public setLevelTile(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.init();
        return this;
    }

    public instanceOf(...tileClass: Array<typeof Tile>) {
        const ground = this.groundTile;
        return tileClass.some((c) => this instanceof c || ground instanceof c);
    }

    public bumpedInto(entity: Entity) {
    }

    public getKeys() {
        return Tiles.getKeys(this.getClass());
    }

    protected addItemEntity(item: Item | ItemRegister<Item>, nb: number = 1) {
        for (let i = 0; i < nb; i++) {
            this.level.add(
                new ItemEntity(item,
                    (this.x << 4) + Random.int(10) + 3,
                    (this.y << 4) + Random.int(10) + 3),
            );
        }
    }
}
