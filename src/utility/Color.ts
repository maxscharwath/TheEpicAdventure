export default class Color {

    static get white() {
        return new Color(255, 255, 255);
    }

    static get red() {
        return new Color(255, 0, 0);
    }

    static get yellow() {
        return new Color(255, 255, 0);
    }

    static get green() {
        return new Color(0, 255, 0);
    }

    static get blue() {
        return new Color(0, 0, 255);
    }

    static get black() {
        return new Color(0, 0, 0);
    }

    public static fromHex(hex: string) {
        const rgb = parseInt(hex.replace(/[^0-9A-F]/gi, ""), 16);
        return new Color(
            ((rgb >> 16) & 0b11111111),
            ((rgb >> 8) & 0b11111111),
            (rgb & 0b11111111),
        );
    }

    public r: number = 0;
    public g: number = 0;
    public b: number = 0;
    public a: number = 1;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    public setAlpha(a: number) {
        this.a = a;
        return this;
    }

    public clone(): Color {
        return new Color(this.r, this.g, this.b, this.a);
    }

    public mix(c: Color): Color {
        this.r = this.r * 0.5 + c.r * 0.5;
        this.g = this.g * 0.5 + c.g * 0.5;
        this.b = this.b * 0.5 + c.b * 0.5;
        return this;
    }

    public toString(): string {
        return `rgba(${this.r},${this.g},${this.b},${this.a})`;
    }

    public getInt(): number {
        return ((this.r << 8) + this.g << 8) + this.b;
    }
}
