export default class Entry {
    private readonly label: string;

    constructor(label: string) {
        this.label = label;
    }

    public setValue(value: any): void {
    }

    public getValue(): any {
    }

    public getLabel(): string {
        return this.label;
    }

    public toString(): string {
        return `${this.getLabel()}: ${this.getValue()}`;
    }
}
