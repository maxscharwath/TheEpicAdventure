import ArrayEntry from "./ArrayEntry";

export default class RangeEntry extends ArrayEntry {

    private static getIntegerArray(min: number, max: number): number[] {
        const ints: number[] = [];
        for (let i = 0; i < (max - min + 1); i++) {
            ints[i] = min + i;
        }
        return ints;
    }

    private readonly max: number;
    private readonly min: number;

    constructor(label: string, min: number, max: number, initial: number) {
        super(label, RangeEntry.getIntegerArray(min, max));
        this.max = max;
        this.min = min;
        this.setValue(initial);
    }

    public setValue(o: number) {
        this.setSelection(o - this.min);
    }
}
