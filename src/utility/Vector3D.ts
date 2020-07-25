export default class Vector3D {
    public x: number = 0;
    public y: number = 0;
    public z: number = 0;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public get2dMagnitude() {
        return Math.hypot(this.x, this.y);
    }

    public toString(): string {
        return `x:${this.x.toFixed(2)} y:${this.y.toFixed(2)} z:${this.z.toFixed(2)}`;
    }

    public get magnitude() {
        return Math.hypot(this.x, this.y, this.z);
    }

    public set magnitude(mag: number) {
        if (this.magnitude === 0) {
            return;
        }
        this.x *= mag / this.magnitude;
        this.y *= mag / this.magnitude;
        this.z *= mag / this.magnitude;
    }

    public get rotation() {
        return Math.atan2(this.x, this.y);
    }
}
