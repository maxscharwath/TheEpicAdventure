import Entry from "./Entry";

export default class StringEntry extends Entry {

    constructor(label: string, text: string) {
        super(label);
        this.text = text;
    }
    private text: string;

    public getValue(): any {
        return this.text;
    }

    public setValue(value: string): void {
        this.text = value;
    }
}
