import Inventory from "../../item/Inventory";
import Maths from "../../utility/Maths";
import Random from "../../utility/Random";
import Vector from "../../utility/Vector";
import Direction from "../Direction";
import Entity from "../Entity";
import ItemEntity from "../ItemEntity";

export default class Mob extends Entity {

    protected get speed() {
        return this.speedMax;
    }

    protected static getAttackDir(attacker: Entity, hurt: Entity): Direction {
        return Direction.getDirection(hurt.x - attacker.x, hurt.y - attacker.y);
    }

    protected speedMax: number = 1;
    protected potionEffect: any[] = [];
    protected walkDist: number = 0;
    protected dir: Direction = Direction.DOWN;
    protected mass = 20;

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
            const R = 4;

            if (dx * dx + dy * dy < 4 * R * R) {
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

        if (this.isSwimming()) {
            xa /= 4;
            ya /= 4;
        }
        if (xa !== 0 || ya !== 0) {
            this.walkDist += Math.max(Maths.abs(xa), Maths.abs(ya));
            this.dir = Direction.getDirection(xa, ya);
            this.onChangeDir(this.dir);
        }
        return super.move(xa, ya);
    }

    protected onChangeDir(dir: Direction) {

    }

    protected attack(dmg: number) {
        if (this.attackCooldown > 0) {
            return;
        }
        this.attackCooldown = 30;
        for (const e of this.getEntitiesVisible(32)) {
            if (!(e instanceof Mob)) {
                continue;
            }
            console.log("ATTACK", e.toString());
            e.hurtByEntity(dmg, this);
        }
    }

    protected getEntitiesRadius(r = 32, ...classEntities: any[]): Entity[] {
        const entities = [];
        for (const chunk of this.getChunkNeighbour()) {
            for (const e of chunk.getEntities()) {
                if (e === this) {
                    continue;
                }
                let next = false;
                for (const classEntity of classEntities) {
                    if (!(e instanceof classEntity)) {
                        next = true;
                    }
                }
                if (next) {
                    continue;
                }
                if (Math.hypot(this.x - e.x, this.y - e.y) < r) {
                    entities.push(e);
                }
            }
        }

        return entities;
    }

    protected getEntitiesVisible(r = 32, fov = 90): Entity[] {
        const entities = [];
        for (const e of this.getEntitiesRadius(r)) {
            if (e === this) {
                continue;
            }
            if (Math.hypot(this.x - e.x, this.y - e.y) < r) {
                const a = (Math.atan2(this.y - e.y, this.x - e.x) * 180 / Math.PI + 180) % 360;
                if (
                    (this.dir === Direction.DOWN && a >= 90 - fov / 2 && a <= 90 + fov / 2) ||
                    (this.dir === Direction.UP && a >= 270 - fov / 2 && a <= 270 + fov / 2) ||
                    (this.dir === Direction.LEFT && a >= 180 - fov / 2 && a <= 180 + fov / 2) ||
                    (this.dir === Direction.RIGHT && a >= 360 - fov / 2 || a <= fov / 2)
                ) {
                    entities.push(e);
                }
            }
        }

        return entities;
    }

    private hurtCooldown: number;
    private attackCooldown: number;

    public static create(data: any): Mob {
        const e = super.create(data) as Mob;
        e.inventory = Inventory.create(data.inventory);
        return e;
    }

    public maxHealth: number = 10;
    public health: number = this.maxHealth;
    public inventory = new Inventory(8);

    constructor(x?: number, y?: number) {
        super(x, y);
        this.interactive = true;
        this.on("click", () => {
            this.die();
        });
    }

    public die(): void {
        for (const slot of this.inventory.slots) {
            if (slot.isItem()) {
                if (Random.int(5) === 0) {
                    continue;
                }
                for (let i = 0; i < slot.nb; i++) {
                    if (Random.int(5) !== 0) {
                        continue;
                    }
                    const x = this.x + Random.int(0, 16);
                    const y = this.y + Random.int(0, 16);
                    // this.level.addEntity(new ItemEntity(slot.item, x, y));
                }
            }
        }
        this.delete();
    }

    public hurtByEntity(dmg: number, entity: Entity): void {
        console.log(`Hurted by ${entity.toString()}`);
        this.hurt(dmg, Mob.getAttackDir(entity, this));
    }

    public hurt(dmg: number, attackDir: Direction = Direction.NONE): void {
        if (this.hurtCooldown > 0) {
            return;
        }
        this.hurtCooldown = 60;
        this.a.z = 2;
        this.a.x = attackDir.getX() * 2;
        this.a.y = attackDir.getY() * 2;
        this.health -= dmg;
    }

    public onTick(): void {
        super.onTick();
        if (this.hurtCooldown > 0) {
            this.hurtCooldown--;
        }
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        if (this.health <= 0) {
            this.die();
        }
    }

    public touchItem(itemEntity: ItemEntity) {
        if (this.inventory.addItem(itemEntity.item, 1)) {
            itemEntity.take(this);
        }
    }

    public getDir() {
        return this.dir;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            inventory: this.inventory,
        };
    }
}
