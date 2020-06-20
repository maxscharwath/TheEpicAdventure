import Inventory from "../../item/Inventory";
import LevelTile from "../../level/LevelTile";
import Maths from "../../utility/Maths";
import Random from "../../utility/Random";
import Vector from "../../utility/Vector";
import Direction from "../Direction";
import Entity from "../Entity";
import ItemEntity from "../ItemEntity";
import DamageParticle from "../particle/DamageParticle";
import Item from "../../item/Item";
import PotionType from "../../item/PotionType";
import PotionEffect from "../PotionEffect";
import HurtParticle from "../particle/HurtParticle";

export default abstract class Mob extends Entity {

    protected get speed() {
        return this.speedMax;
    }

    public static create(data: any): Mob {
        const e = super.create(data) as Mob;
        e.inventory = Inventory.create(data.inventory);
        return e;
    }

    protected static getAttackDir(attacker: Entity, hurt: Entity): Direction {
        return Direction.getDirection(hurt.x - attacker.x, hurt.y - attacker.y);
    }

    public maxHealth: number = 20;
    public health: number = this.maxHealth;
    public inventory = new Inventory(9);
    protected speedMax: number = 1;
    protected potionEffect: PotionEffect[] = [];
    protected walkDist: number = 0;
    protected dir: Direction = Direction.DOWN;
    protected mass = 20;
    private hurtCooldown: number = 0;
    private attackCooldown: number = 0;

    public getInteractTile(): LevelTile | undefined {
        return this.level?.getTile((this.x + (this.dir.getX() * 12)) >> 4, (this.y + (this.dir.getY() * 12)) >> 4);
    }

    public die(): void {
        for (const slot of this.inventory.slots) {
            if (!slot.isItem()) continue;
            if (Random.int(5) === 0) continue;
            for (let i = 0; i < slot.nb; i++) {
                if (Random.int(5) !== 0) continue;
                const x = this.x + Random.int(0, 16);
                const y = this.y + Random.int(0, 16);
                this.level?.add(new ItemEntity(slot.item, x, y));
            }
        }
        this.delete();
    }

    public hurtByEntity(dmg: number, entity: Entity): void {
        console.log(`Hurted by ${entity.toString()}`);
        this.hurt(dmg, Mob.getAttackDir(entity, this));
    }

    public hurt(dmg: number, attackDir: Direction = Direction.NONE): void {
        if (this.hurtCooldown > 0) return;
        this.hurtCooldown = 5;
        this.a.z = 2;
        this.a.x = attackDir.getX() * 2;
        this.a.y = attackDir.getY() * 2;
        this.health -= dmg;
        this.level.add(new DamageParticle(this.x, this.y, -dmg, 0xc80000));
        this.level.add(new HurtParticle(this.x, this.y));
    }

    public dropItem(item: Item) {
        const itemEntity = new ItemEntity(item, this.x, this.y);
        if (this.level.add(itemEntity)) {
            this.inventory.removeItem(item, 1);
            const force = this.random.number(0.5, 1.5);
            const range = this.random.number(-0.25, 0.25);
            itemEntity.a.x = this.dir.getX() * force + range;
            itemEntity.a.y = this.dir.getY() * force + range;
        }
    }

    public onTick(): void {
        super.onTick();

        for (const effect of this.potionEffect) {
            effect.duration--;
            if (effect.duration <= 0) {
                this.removePotionEffect(effect);
            }
        }

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

    public getDir(): Direction {
        return this.dir;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            inventory: this.inventory,
        };
    }

    public checkPotionEffect(type: PotionType) {
        for (const effect of this.potionEffect) {
            if (effect.type === type) {
                return effect;
            }
        }
        return false;
    }

    public removePotionEffect(effect: PotionEffect): void;
    public removePotionEffect(type: PotionType): void;
    public removePotionEffect(value: PotionEffect | PotionType): void {
        const type = value instanceof PotionEffect ? value.type : value;
        this.potionEffect = this.potionEffect.filter((effect) => effect.type !== type);
    }

    public addPotionEffect(type: PotionType) {
        if (!this.checkPotionEffect(type)) {
            this.potionEffect.push(new PotionEffect(type));
            return true;
        }
        return false;
    }

    protected move(xa: number, ya: number): boolean {
        if (this.onGround()) {
            let entities = this.getChunk()?.getEntities() ?? [];
            const maxEntities = 50;
            if (entities.length > maxEntities) {
                const i = Random.int(entities.length - maxEntities);
                entities = entities.slice(i, i + maxEntities);
            }

            const a = new Vector();
            for (const e of entities) {
                if (e === this || !e.onGround()) continue;
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
        }

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
        if (this.attackCooldown > 0) return;
        this.attackCooldown = 30;
        this.getEntitiesVisible(2).then((entities) => {
            entities.forEach((entity) => {
                if (entity instanceof Mob) {
                    console.log("ATTACK", entity.toString());
                    entity.hurtByEntity(dmg, this);
                }
            });
        });
    }

    protected getEntitiesRadius(radius = 2, predicate: (value: Entity) => boolean = () => true): Promise<Entity[]> {
        return this.level.findEntitiesInRadius(predicate, this.x >> 4, this.y >> 4, radius);
    }

    protected getEntitiesVisible(radius: number = 2, fov = 90): Promise<Entity[]> {
        return this.getEntitiesRadius(radius, (entity) => {
            if (entity === this) return false;
            const a = (Math.atan2(this.y - entity.y, this.x - entity.x) * 180 / Math.PI + 180) % 360;
            return (
                (this.dir === Direction.DOWN && a >= 90 - fov / 2 && a <= 90 + fov / 2) ||
                (this.dir === Direction.UP && a >= 270 - fov / 2 && a <= 270 + fov / 2) ||
                (this.dir === Direction.LEFT && a >= 180 - fov / 2 && a <= 180 + fov / 2) ||
                (this.dir === Direction.RIGHT && a >= 360 - fov / 2 || a <= fov / 2)
            );
        });
    }
}
