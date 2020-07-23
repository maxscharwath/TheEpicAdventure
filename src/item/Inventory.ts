import Item from "./Item";
import {ItemRegister} from "./Items";
import Slot from "./Slot";

export default class Inventory {

    public static create(data: any): Inventory {
        const inventory = new Inventory(data.nbSlots);
        for (const slotData of data.slots) {
            const slot = inventory.slots[slotData.pos];
            slot.nb = slotData.nb;
            slot.item = Item.create(slotData.item);
        }
        return inventory;
    }

    public indexedSlot: number = 0;
    public slots: Slot[] = [];
    private STACK_MAX: number = 64;

    constructor(nbSlot: number = 9) {
        this.addSlots(nbSlot);
    }

    public selectedSlot(): Slot {
        return this.slots[this.indexedSlot];
    }

    public selectedItem(): Item | undefined {
        const slot = this.slots[this.indexedSlot];
        if (!(slot && slot.isItem())) return undefined;
        return slot.item;
    }

    public addSlots(nb: number): void {
        for (let i = 0; i < nb; i++) {
            this.slots.push(new Slot());
        }
    }

    public move(a: number, b: number) {
        if (a < 0) {
            a += this.slots.length;
        }
        if (a >= this.slots.length) {
            a -= this.slots.length;
        }
        if (b < 0) {
            b += this.slots.length;
        }
        if (b >= this.slots.length) {
            b -= this.slots.length;
        }
        this.fusion(a, b);
        this.slots[a] = this.slots.splice(b, 1, this.slots[a])[0];
        return b;
    }

    public clear(): void {
        for (const slot of this.slots) {
            slot.clear();
        }
    }

    public getItem(item: Item): Item | boolean {
        return false;
    }

    public hasItem(item: Item | ItemRegister<Item>, count: number) {
        for (const slot of this.slots) {
            if (slot.item instanceof Item) {
                if (slot.item.tag === item.tag) {
                    return (slot.nb >= count);
                }
            }

        }
        return false;
    }

    public removeThisItem(item: Item, itemNb: number = 1) {
        for (const slot of this.slots) {
            if (slot.item === item) {
                slot.removeItem(itemNb);
            }
        }
    }

    public removeItem(item: Item | ItemRegister<Item>, itemNb = 1): boolean {
        if (!item) return false;
        for (const slot of this.slots) {
            if (slot.item == null) {
                continue;
            }
            if (slot.item.tag === item.tag) {
                const n = slot.removeItem(itemNb);
                if (n >= 0) return true;
                itemNb += n;
            }
        }
        return false;
    }

    public addItem(item: Item | ItemRegister<Item>, itemNb = 1): boolean {
        if (item instanceof ItemRegister) {
            item = item.item;
        }
        if (!(item instanceof Item)) return false;
        const stack = item.isStackable() ? this.STACK_MAX : 1;

        for (const slot of this.slots) {
            if (slot.item instanceof Item) {
                if (slot.item.tag !== item.tag) {
                    continue;
                }
            }
            if (itemNb === 0) return true;

            const nb = slot.nb + itemNb;

            if (nb > stack) {
                itemNb = nb - stack;
                slot.nb = stack;
                continue;
            }
            slot.item = item;
            slot.nb += itemNb;
            return true;
        }
        if (itemNb > 0) {
            console.log("NO PLACE FOR " + item.getDisplayName() + " EXCESS OF " + itemNb);
            return false;
        }
        // need to verify
        return true;
    }

    public count(item: Item) {
        let count = 0;
        for (const slot of this.slots) {
            if (slot.item instanceof Item) {
                if (slot.item.tag === item.tag) {
                    count += slot.nb;
                }
            }
        }
        return count;
    }

    public clone() {
        const inventory = new Inventory();
        for (const slot of this.slots) {
            inventory.slots.push(slot.clone());
        }
        return inventory;
    }

    public getSlot(index: number): Slot {
        return this.slots[index];
    }

    public toBSON() {
        const slots: { pos: number, item?: Item, nb: number }[] = [];
        this.slots.forEach((slot, index) => {
            if (slot instanceof Slot && !slot.isEmpty()) {
                slots.push({
                    pos: index,
                    item: slot.item,
                    nb: slot.nb,
                });
            }
        });
        return {nbSlots: this.slots.length, slots};
    }

    private fusion(a: number, b: number): boolean {
        if (!(this.slots[a] instanceof Slot) || !(this.slots[b] instanceof Slot)) {
            return false;
        }
        if (this.slots[a].item === null || this.slots[b].item === null) {
            return false;
        }
        if (this.slots[a].item?.tag !== this.slots[b].item?.tag) {
            return false;
        }

        const item = this.slots[a].item;
        const stack = item?.isStackable() ? this.STACK_MAX : 1;

        this.slots[a].nb += this.slots[b].nb;
        this.slots[b].nb = this.slots[a].nb - stack;
        if (this.slots[b].nb <= 0) {
            this.slots[b].clear();
        }
        if (this.slots[a].nb > stack) {
            this.slots[a].nb = stack;
        }
        return true;

    }
}
