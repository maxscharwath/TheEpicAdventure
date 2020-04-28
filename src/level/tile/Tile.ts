import * as PIXI from "pixi.js";
import Localization from "../../core/io/Localization";
import {Mob} from "../../entity";
import Entity from "../../entity/Entity";
import Item from "../../item/Item";
import Random from "../../utility/Random";
import LevelTile from "../LevelTile";

type Type<T> = new (...args: any[]) => T;
export default class Tile {
    public isInit: boolean = false;

    protected static loadTextures(path: string, nb: number): PIXI.Texture[] {
        const bt = PIXI.BaseTexture.from(path);
        const textures = [];
        for (let x = 0; x < nb; x++) {
            textures.push(new PIXI.Texture(bt, new PIXI.Rectangle(x * 16, 0, 16, 16)));
        }
        return textures;
    }

    protected random: Random;
    protected levelTile: LevelTile;

    public static SIZE = 16;
    public static readonly TAG: string = "tile";
    public container = new PIXI.Container();
    public groundTile?: Tile;

    public ["constructor"]: typeof Tile;

    public light: number = 1;
    public maySpawn: boolean = false;
    public friction: number = 0.1;

    constructor(levelTile: LevelTile) {
        this.levelTile = levelTile;
        this.random = levelTile.random;
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

    protected get level() {
        return this.levelTile.level;
    }

    protected get x() {
        return this.levelTile.getLocalX();
    }

    protected get y() {
        return this.levelTile.getLocalY();
    }
}
