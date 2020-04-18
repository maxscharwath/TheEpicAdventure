import Item from "./Item";

export default class Slot {
    public nb: number = 0;
    public item: Item = null;

    constructor(item?: Item, nb: number = 0) {
        this.nb = nb;
        this.item = item;
    }

    public clear() {
        this.item = null;
        this.nb = 0;
    }

    public isItem() {
        return this.item instanceof Item;
    }

    // @BUG
    public removeItem(nb: number): number {
        const n = this.nb -= nb;
        if (this.nb <= 0) {
            this.clear();
        }
        return n;
    }

    public clone(): Slot {
        return new Slot(this.item, this.nb);
    }

    public isEmpty(): boolean {
        return this.item == null || this.nb <= 0 || this.nb == null;
    }

    public toJSON() {
        if (this.isEmpty()) {
            return null;
        }
        return {
            item: this.item,
            nb: this.nb,
        };
    }
}
