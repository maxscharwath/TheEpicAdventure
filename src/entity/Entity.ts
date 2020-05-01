import * as PIXI from "pixi.js";
import uniqid from "uniqid";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";
import Chunk from "../level/Chunk";
import Level from "../level/Level";
import LevelTile from "../level/LevelTile";
import Hitbox from "../utility/Hitbox";
import Maths from "../utility/Maths";
import Random from "../utility/Random";
import Vector3D from "../utility/Vector3D";
import Entities from "./Entities";
import Tickable from "./Tickable";

export default class Entity extends PIXI.Container implements Tickable {

    protected get aSpeed(): number {
        return Math.hypot(this.a.x, this.a.y);
    }

    protected random = this.constructor.random;
    protected level: Level;
    protected deleted: boolean;
    protected isMoving: boolean;
    protected container = new PIXI.Container();

    protected init() {
    }

    protected move(xa: number, ya: number): boolean {
        xa *= Renderer.delta;
        ya *= Renderer.delta;
        let stopped = true;
        if (this.move2(xa, 0)) {
            stopped = false;
        }
        if (this.move2(0, ya)) {
            stopped = false;
        }
        if (!stopped) {
            this.isMoving = Math.hypot(xa, ya) > 0;
            if (this.isMoving) {
                this.steppedOn();
                return true;
            }
            return false;
        }
        return false;
    }

    protected steppedOn() {
        if (this.z > 0) {
            return;
        }
        const xt = this.x >> 4;
        const yt = this.y >> 4;
        this.level.getTile(xt, yt)?.steppedOn(this);
    }

    protected move2(xa: number, ya: number): boolean {
        const xto0 = ((this.x) - this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yto0 = ((this.y) - this.hitbox.height * 0.5 + this.hitbox.y) >> 4;
        const xto1 = ((this.x) + this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yto1 = ((this.y) + this.hitbox.height * 0.5 + this.hitbox.y) >> 4;

        const xt0 = ((this.x + xa) - this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yt0 = ((this.y + ya) - this.hitbox.height * 0.5 + this.hitbox.y) >> 4;
        const xt1 = ((this.x + xa) + this.hitbox.width * 0.5 + this.hitbox.x) >> 4;
        const yt1 = ((this.y + ya) + this.hitbox.height * 0.5 + this.hitbox.y) >> 4;

        let blocked = false;
        for (let yt = yt0; yt <= yt1; yt++) {
            for (let xt = xt0; xt <= xt1; xt++) {
                if (xt >= xto0 && xt <= xto1 && yt >= yto0 && yt <= yto1) {
                    continue;
                }

                // this.level.getTile(xt, yt).bumpedInto(this.level, xt, yt, this);
                const tile = this.level.getTile(xt, yt);
                if (!tile || !tile.mayPass(this)) {
                    blocked = true;
                    return false;
                }
            }
        }
        if (blocked) {
            return false;
        }

        this.x += xa;
        this.y += ya;
        return true;
    }

    protected calculateZIndex() {
        return this.y + this.hitbox.y + this.hitbox.height / 2;
    }

    private static random = new Random();
    private lastTick: number = Updater.tickCount;
    private uid: string = uniqid();

    private getCentredPos() {
        return {
            x: this.x + this.hitbox.x + this.hitbox.width / 2,
            y: this.y + this.hitbox.y + this.hitbox.height / 2,
        };
    }

    public static create(data: any): Entity {
        const EntityClass = Entities.getByTag(data.id);
        if (!EntityClass) {
            return;
        }
        const e = new EntityClass();
        e.x = data.x;
        e.y = data.y;
        return e;
    }

    public ["constructor"]: typeof Entity;
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;
    public a: Vector3D = new Vector3D();
    public hitbox: Hitbox = new Hitbox();
    public ticks: number = 0;

    constructor(x: number = 0, y: number = 0) {
        super();
        this.hitbox.set(0, 4, 8, 8);
        this.x = x;
        this.y = y;
        {
            this.visible = true;
            this.addChild(this.container);
            this.addChild(this.hitbox);
            this.init();
        }
    }

    public isActive() {
        return (Updater.tickCount - this.lastTick) < 50;
    }

    public onTick(): void {
        this.lastTick = Updater.tickCount;
        this.ticks++;
    }

    public onRender() {
        this.z += this.a.z;
        if (this.z < 0) {
            if (this.a.z < -2) {
                // this.dust.set();
            }
            this.z = 0;
            this.a.z *= -0.5;
        }
        if (this.z <= 0) {
            const friction = this.getTile()?.getFriction() ?? 1;
            this.a.x -= this.a.x * friction;
            this.a.y -= this.a.y * friction;
        } else {
            this.a.x -= this.a.x * 0.01;
            this.a.y -= this.a.y * 0.01;
        }
        if (Maths.abs(this.a.x) < 0.05) {
            this.a.x = 0;
        }
        if (Maths.abs(this.a.y) < 0.05) {
            this.a.y = 0;
        }
        this.a.z -= this.level.gravity;

        if (!(this.a.x === 0 && this.a.y === 0)) {
            this.move(this.a.x, this.a.y);
        }

        this.zIndex = this.calculateZIndex();
        this.container.pivot.y = this.z;
    }

    public onGround(): boolean {
        return this.z <= 0;
    }

    public canSwim() {
        return false;
    }

    public canFly() {
        return false;
    }

    public isSwimming() {
        if (this.canFly()) {
            return false;
        }
        if (this.z > 0) {
            return false;
        }
        const tile = this.getTile();
        return tile && (tile.is("water") || tile.is("lava"));
    }

    public getChunk(): Chunk {
        return this.level.getChunk(this.x >> 8, this.y >> 8);
    }

    public getChunkNeighbour(): Chunk[] {
        return this.level.getChunkNeighbour(this.x >> 8, this.y >> 8);
    }

    public getLevel(): Level {
        return this.level;
    }

    public getTile(): LevelTile {
        const {x, y} = this.getCentredPos();
        return this.level.getTile(x >> 4, y >> 4);
    }

    public getRemoved(): boolean {
        return this.deleted;
    }

    public getLightRadius(): number {
        return 0;
    }

    public die(): void {
        this.delete();
    }

    public remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public add() {
        this.level.entitiesContainer.addChild(this);
    }

    public delete(level?: Level): void {
        this.remove();
        if (level === undefined) {
            this.deleted = true;
            if (this.level instanceof Level) {
                this.level.remove(this);
            }
            return;
        }
        if (level === this.level) {
            this.deleted = true;
            this.level = null;
        }
    }

    public setLevel(level: Level, x: number, y: number): void {
        this.level = level;
        this.x = x;
        this.y = y;
    }

    public getName() {
        return "this.constructor.name";
    }

    public toString(): string {
        return `${this.getName()}#${this.uid}`;
    }

    public getKeys() {
        return Entities.getKeys(this.constructor);
    }

    public toBSON() {
        return {
            id: this.getKeys().tag,
            uid: this.uid,
            x: ~~this.x,
            y: ~~this.y,
        };
    }

    public touchedBy(entity: Entity): void {
    }
}
