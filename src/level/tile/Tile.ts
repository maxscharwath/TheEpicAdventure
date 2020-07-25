import * as PIXI from "pixi.js";
import Localization from "../../core/io/Localization";
import {ItemEntity, Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import {ItemRegister} from "../../item/Items";
import Random from "../../utility/Random";
import LevelTile from "../LevelTile";
import TileStates from "./TileStates";
import Tiles, {TileRegister} from "./Tiles";

export default abstract class Tile {

    public static DEFAULT_STATES = {};
    public static readonly TAG: string = "tile";
    public static readonly COLOR: number = 0x123456;
    public z: number = 0;
    public states = TileStates.create();
    public isInit: boolean = false;
    public container = new PIXI.Container();
    public sortableContainer = new PIXI.Container();
    public ["constructor"]: typeof Tile;
    public light: number = 1;
    public friction: number = 0.1;
    public anchor = 0;
    public offset = new PIXI.Point();
    private isMainTile = true;
    protected random: Random;
    protected levelTile: LevelTile;
    protected groundTile?: Tile;
    protected groundContainer = new PIXI.Container();

    constructor(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.random = levelTile.random;
        this.container.addChild(this.groundContainer);
    }

    protected get level() {
        return this.levelTile.level;
    }

    protected get x() {
        return this.levelTile.getLocalX();
    }

    protected get y() {
        return this.levelTile.getLocalY();
    }

    protected static loadTextures(path: string, nb: number): PIXI.Texture[] {
        const bt = PIXI.BaseTexture.from(path);
        const textures = [];
        for (let x = 0; x < nb; x++) {
            textures.push(new PIXI.Texture(bt, new PIXI.Rectangle(x * 16, 0, 16, 16)));
        }
        return textures;
    }

    public getClass(): typeof Tile {
        return Object.getPrototypeOf(this).constructor;
    }

    public setGroundTile(tile: typeof Tile | Tile | TileRegister<typeof Tile>): Tile | undefined {
        if (tile instanceof Tile) {
            if (this.groundTile?.instanceOf(tile.getClass())) return undefined;
            this.groundTile = tile;
        } else if (tile instanceof TileRegister) {
            // @ts-ignore
            this.groundTile = new tile.tile(this.levelTile);
        } else {
            if (this.groundTile?.instanceOf(tile)) return undefined;
            // @ts-ignore
            this.groundTile = new tile(this.levelTile);
        }
        this.groundTile.isMainTile = false;
        if (this.groundTile.light > this.light) this.light = this.groundTile.light;
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

    public instanceOf(...tileClass: (typeof Tile | TileRegister<typeof Tile>)[]) {
        const ground = this.groundTile;
        return tileClass.some((t) => {
            const c = t instanceof TileRegister ? t.tile : t;
            return this instanceof c || ground instanceof c;
        });
    }

    public bumpedInto(entity: Entity) {
    }

    public getKeys() {
        return Tiles.getKeys(this.getClass());
    }


    public setTile<T extends typeof Tile>(tile: T, states?: typeof tile.DEFAULT_STATES, entity?: Entity): void;
    public setTile<T extends typeof Tile>(
        tile: TileRegister<T>, states?: typeof tile.tile.DEFAULT_STATES, entity?: Entity): void;
    public setTile<T extends typeof Tile>(tile: T | TileRegister<T>, states?: {}, entity?: Entity): void {
        if (this.isMainTile) {
            // @ts-ignore
            this.levelTile.setTile(tile, states, entity);
        } else {
            this.setGroundTile(tile);
        }
    }

    protected addItemEntity(item: Item | ItemRegister<Item>, nb: number | [number, number] = 1): void {
        const x = Array.isArray(nb) ? this.random.int(nb[0], nb[1]) : nb;
        if (x <= 0) return;
        for (let i = 0; i < x; i++) {
            this.level.add(
                new ItemEntity(item,
                    (this.x << 4) + Random.int(16),
                    (this.y << 4) + Random.int(16),
                ),
            );
        }
    }

    protected setTileToGround() {
        if (this.groundTile) this.setTile(this.groundTile.getClass());
    }

    protected onDestroy() {

    }
}
