import Random from "../utility/Random";
import Item from "./Item";
import Tiers from "./Tiers";
import ToolType from "./ToolType";
import LevelTile from "../level/LevelTile";
import Mob from "../entity/mob/Mob";

export default class ToolItem extends Item {

    public readonly type: ToolType;
    private readonly level: number;
    private readonly durabilityMax: number;
    private durability: number;

    constructor(tag: string, type: ToolType, level = Tiers.WOOD) {
        super(tag);
        this.type = type;
        if (level > ToolType.levelName.length - 1) {
            level = ToolType.levelName.length - 1;
        }
        this.level = level;
        this.durabilityMax = 40 + level * 10;
        this.durability = this.durabilityMax;
        this.texture = type.textures[level];
        this.tag = ToolType.levelName[this.level] + "_" + this.type.name;
    }

    public static create(data: any) {
        const item = super.create(data) as ToolItem;
        item.durability = data.durability;
        return item;
    }

    public fix(amount: number) {
        this.durability = Math.min(this.durability + amount, this.durabilityMax);
    }

    public isStackable() {
        return false;
    }

    public canAttack(): boolean {
        return true;
    }

    public getAttackDamageBonus(): number {
        if (this.type === ToolType.axe) {
            return (this.level + 1) * 2 + Random.int(4);
        }
        if (this.type === ToolType.pickaxe) {
            return (this.level + 1) * 2;
        }
        if (this.type === ToolType.sword) {
            return (this.level + 1) * 3 + Random.int(this.level * this.level);
        }
        return 1;
    }

    public useOn(levelTile: LevelTile, mob: Mob): boolean {
        if (this.durability <= 0) {
            this.destroy(mob);
            return false;
        }
        if (this.getCooldownTime() <= this.getCooldown()) return false;
        if (super.useOn(levelTile, mob)) {
            this.durability--;
            return true;
        }
        return false;
    }

    public toBSON(): any {
        return {
            ...super.toBSON(),
            durability: this.durability,
        };
    }

    public getCooldown(): number {
        return ((ToolType.nbLevel - this.level) + 1) * 2;
    }
}
