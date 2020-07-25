export default class Vector {

    public x: number = 0;
    public y: number = 0;
    private readonly constant: boolean = false;

    constructor(x: number = 0, y: number = 0, constant: boolean = false) {
        this.x = x;
        this.y = y;
        this.constant = constant;
    }

    public get magnitude() {
        return Math.hypot(this.x, this.y);
    }

    public set magnitude(mag: number) {
        if (this.magnitude === 0) {
            return;
        }
        this.x *= mag / this.magnitude;
        this.y *= mag / this.magnitude;
    }

    public get rotation() {
        return Math.atan2(this.x, this.y);
    }

    private get vector(): Vector {
        if (!this.constant) {
            return this;
        }
        return this.clone();
    }

    public static create(x?: number, y?: number) {
        return new Vector(x, y);
    }

    public static createConstant(x?: number, y?: number) {
        return new Vector(x, y, true);
    }

    public negative(): Vector {
        this.vector.x *= -1;
        this.vector.y *= -1;
        return this.vector;
    }

    public add(v: Vector | number): Vector {
        if (v instanceof Vector) {
            this.vector.x += v.x;
            this.vector.y += v.y;
        } else {
            this.vector.x += v;
            this.vector.y += v;
        }
        return this.vector;
    }

    public subtract(v: Vector | number): Vector {
        if (v instanceof Vector) {
            this.vector.x -= v.x;
            this.vector.y -= v.y;
        } else {
            this.vector.x -= v;
            this.vector.y -= v;
        }
        return this.vector;
    }

    public multiply(v: Vector | number): Vector {
        if (v instanceof Vector) {
            this.vector.x *= v.x;
            this.vector.y *= v.y;
        } else {
            this.vector.x *= v;
            this.vector.y *= v;
        }
        return this.vector;
    }

    public divide(v: Vector | number): Vector {
        if (v instanceof Vector) {
            if (v.x !== 0) {
                this.vector.x /= v.x;
            }
            if (v.y !== 0) {
                this.vector.y /= v.y;
            }
        } else {
            if (v !== 0) {
                this.vector.x /= v;
                this.vector.y /= v;
            }
        }
        return this.vector;
    }

    public equals(v: Vector): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    public cross(v: Vector): number {
        return this.x * v.y - this.y * v.x;
    }

    public length(): number {
        return Math.sqrt(this.dot(this));
    }

    public lengthSq(): number {
        return this.dot(this);
    }

    public normalize(): Vector {
        return this.vector.divide(this.vector.length());
    }

    public min(): number {
        return Math.min(this.x, this.y);
    }

    public max(): number {
        return Math.max(this.x, this.y);
    }

    public toAngle(): number {
        return -Math.atan2(-this.y, this.x);
    }

    public setAngle(a: number): Vector {
        const length = this.vector.length();
        this.vector.x = Math.cos(a) * length;
        this.vector.y = Math.sin(a) * length;
        return this.vector;
    }

    public angleBetween(a: Vector): number {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    public toArray(n: number): number[] {
        return [this.x, this.y].slice(0, n || 2);
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public set(x: number, y: number): Vector {
        this.vector.x = x;
        this.vector.y = y;
        return this.vector;
    }


}
