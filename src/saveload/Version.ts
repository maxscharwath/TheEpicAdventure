export default class Version {

    private static parseInt(n: any): number {
        if (isNaN(Number(n))) {
            throw new Error("Not a number");
        }
        return parseInt(n, 10);
    }

    private static Number(n: any): number {
        if (isNaN(Number(n))) {
            throw new Error("Not a number");
        }
        return Number(n);
    }

    private static compare(a: number, b: number): number {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }

    private readonly valid: boolean = true;
    private readonly major: number;
    private readonly minor: number;
    private readonly dev: number;

    constructor(version: string) {
        const nums: string[] = version.split(".");
        try {
            if (nums.length > 0) {
                this.major = Version.parseInt(nums[0]);
            } else {
                this.major = 0;
            }

            let min: string;
            if (nums.length > 1) {
                min = nums[1];
            } else {
                min = "";
            }

            if (min.includes("-")) {
                const mindev: string[] = min.split("-");
                this.minor = Version.parseInt(mindev[0]);
                this.dev = Version.Number(mindev[1].replace("pre", "").replace("dev", ""));
            } else {
                if (min !== "") {
                    this.minor = Version.parseInt(min);
                } else {
                    this.minor = 0;
                }
                this.dev = 0;
            }
        } catch (e) {
            this.valid = false;
        }
    }

    public isValid(): boolean {
        return this.valid;
    }

    public compareTo(ov: Version): number {
        if (this.major !== ov.major) {
            return Version.compare(this.major, ov.major);
        }
        if (this.minor !== ov.minor) {
            return Version.compare(this.minor, ov.minor);
        }
        if (this.dev !== ov.dev) {
            if (this.dev === 0) {
                return 1;
            }
            if (ov.dev === 0) {
                return -1;
            }
            return Version.compare(this.dev, ov.dev);
        }
        return 0;
    }

    public toString(): string {
        return `${this.major}.${this.minor}.${this.dev === 0 ? "" : "-dev" + this.dev}`;
    }
}
