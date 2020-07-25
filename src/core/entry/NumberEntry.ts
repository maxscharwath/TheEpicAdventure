import Entry from "./Entry";

export default class NumberEntry extends Entry {

    constructor(label: string, number: number) {
        super(label);
        this.number = number;
    }
    private number: number;

    public getValue(): number {
        return this.number;
    }

    public setValue(value: number): void {
        this.number = value;
    }
}
