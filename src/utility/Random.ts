import System from "../core/System";

export default class Random {

    private static $ = Random.create();
    private nextGaussian: number;
    private haveNextGaussian: boolean = false;

    public static int(num1: number, num2?: number): number {
        return Random.$.int(num1, num2);
    }

    public static float(): number {
        return Random.$.float();
    }

    public static boolean(): boolean {
        return Random.$.boolean();
    }

    public static probability(prob: number): boolean {
        return Random.$.probability(prob);
    }

    public static gaussian(): number {
        return Random.$.gaussian();
    }

    public static create(seed?: number): Random {
        return new Random(seed);
    }
    public seed: number;

    constructor(seed = System.currentTimeMillis()) {
        this.seed = seed;
    }

    public random(): number {
        const x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }

    public int(num1: number, num2?: number): number {
        if (num2 === undefined) {
            return Math.floor(this.random() * num1);
        } else {
            return Math.floor(this.random() * (num2 - num1)) + num1;
        }
    }

    public float(): number {
        return this.random();
    }

    public boolean(): boolean {
        return this.random() >= 0.5;
    }

    public probability(prob: number): boolean {
        return this.random() <= prob;
    }

    public gaussian(): number {
        if (this.haveNextGaussian) {
            this.haveNextGaussian = false;
            return this.nextGaussian;
        } else {
            let v1, v2, s;
            do {
                v1 = 2 * this.float() - 1;
                v2 = 2 * this.float() - 1;
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s === 0);
            const multiplier = Math.sqrt(-2 * Math.log(s) / s);
            this.nextGaussian = v2 * multiplier;
            this.haveNextGaussian = true;
            return v1 * multiplier;
        }
    }
}
