import electron from "electron";

const app: electron.App = (electron.app || electron.remote.app);
export default class Version {

    private static compare(a: number, b: number): number {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    }

    private static Number(n: any): number {
        if (isNaN(Number(n))) {
            throw new Error("Not a number");
        }
        return Number(n);
    }

    private static parseInt(n: any): number {
        if (isNaN(Number(n))) {
            throw new Error("Not a number");
        }
        return parseInt(n, 10);
    }

    constructor(version: string = app.getVersion()) {
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
                const minDev: string[] = min.split("-");
                this.minor = Version.parseInt(minDev[0]);
                this.dev = Version.Number(minDev[1].replace("pre", "").replace("dev", ""));
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
    private readonly dev: number = 0;
    private readonly major: number = 0;
    private readonly minor: number = 0;

    private readonly valid: boolean = true;

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

    public isValid(): boolean {
        return this.valid;
    }

    public toString(): string {
        return `${this.major}.${this.minor}.${this.dev === 0 ? "" : "-dev" + this.dev}`;
    }
}
