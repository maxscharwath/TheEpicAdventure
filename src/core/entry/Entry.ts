export default class Entry {

    constructor(label: string) {
        this.label = label;
    }
    private readonly label: string;

    public getLabel(): string {
        return this.label;
    }

    public getValue(): any {
    }

    public setValue(value: any): void {
    }

    public toString(): string {
        return `${this.getLabel()}: ${this.getValue()}`;
    }
}
