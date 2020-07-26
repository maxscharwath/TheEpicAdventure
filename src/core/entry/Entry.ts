export default abstract class Entry {

    protected constructor(label: string) {
        this.label = label;
    }
    private readonly label: string;

    public getLabel(): string {
        return this.label;
    }

    public abstract getValue(): any;

    public abstract setValue(value: any): void;

    public toString(): string {
        return `${this.getLabel()}: ${this.getValue()}`;
    }
}
