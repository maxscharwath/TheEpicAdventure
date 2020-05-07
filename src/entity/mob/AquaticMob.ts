import {Entity} from "../";
import Tiles from "../../level/tile/Tiles";
import Maths from "../../utility/Maths";
import Random from "../../utility/Random";
import Vector from "../../utility/Vector";
import Direction from "../Direction";
import Mob from "./Mob";

export default abstract class AquaticMob extends Mob {
    protected target = {x: 0, y: 0};

    protected newTarget() {
        if (!this.level) {
            return;
        }
        const tile = this.level.getRandomTileInEntityRadius([Tiles.WATER.tile], this, 10);
        if (tile) {
            this.target = {
                x: tile.getLocalX() << 4,
                y: tile.getLocalY() << 4,
            };
        }
    }

    protected move(xa: number, ya: number): boolean {
        let entities = this.getChunk().getEntities();
        const maxEntities = 10;
        if (entities.length > maxEntities) {
            const i = Random.int(entities.length - maxEntities);
            entities = entities.slice(i, i + maxEntities);
        }

        const a = new Vector();
        for (const e of entities) {
            if (e === this) {
                continue;
            }
            const dx = this.x - e.x === 0 ? Random.float() : this.x - e.x;
            const dy = this.y - e.y === 0 ? Random.float() : this.y - e.y;
            const R = 8;

            if (Math.hypot(dx, dy) < R) {
                e.touchedBy(this);
                if (e instanceof Mob) {
                    a.x += dx / 20 / this.mass;
                    a.y += dy / 20 / this.mass;
                    a.y += dy / 20 / this.mass;
                }
            }
        }
        a.magnitude = 0.2;
        this.a.x += a.x;
        this.a.y += a.y;

        if (!this.isSwimming()) {
            xa /= 10;
            ya /= 10;
        }
        if (xa !== 0 || ya !== 0) {
            this.walkDist += Math.max(Maths.abs(xa), Maths.abs(ya));
            this.dir = Direction.getDirection(xa, ya);
            this.onChangeDir(this.dir);
        }
        return super.move(xa, ya);
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
                const tile = this.level.getTile(xt, yt);
                if (!tile || (this.isSwimming() || !tile.mayPass(this)) && !tile.instanceOf(Tiles.WATER.tile)) {
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

    constructor(x: number = 0, y: number = 0) {
        super(x, y);
        this.newTarget();
    }

    public onTick(): void {
        super.onTick();
        if (!(this.target instanceof Entity) && this.random.int(100) === 0) {
            this.newTarget();
        }
    }

    public onRender() {
        super.onRender();
        let speedX = this.speed;
        let speedY = this.speed;
        let xa = 0;
        let ya = 0;


        if (this.x > this.target.x) {
            xa = -1;
        }
        if (this.x < this.target.x) {
            xa = 1;
        }
        if (this.y > this.target.y) {
            ya = -1;
        }
        if (this.y < this.target.y) {
            ya = 1;
        }

        const absX = Maths.abs(this.x - this.target.x);
        const absY = Maths.abs(this.y - this.target.y);
        if (absX <= speedX) {
            speedX = absX;
        }
        if (absY <= speedY) {
            speedY = absY;
        }


        if (this.aSpeed < this.speed) {
            this.a.x += xa / 10;
            this.a.y += ya / 10;
        }
    }

    public touchedBy(entity: Entity): void {
        // if(!(entity instanceof HostileMob)){
        //     this.target = entity;
        // }
    }
}
