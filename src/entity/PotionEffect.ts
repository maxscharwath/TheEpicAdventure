import PotionType from "../item/PotionType";

export default class PotionEffect {
    public readonly type: PotionType;
    public duration: number;
    constructor(potionType: PotionType) {
        this.type = potionType;
        this.duration = potionType.duration;
    }

    public remainingPercent() {
        return this.duration / this.type.duration * 100;
    }
}
