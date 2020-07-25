import Updater from "./Updater";

export default class Time {
    public id: number;
    public static DAY = new Time(1, 0.1, 0.5);
    public static EVENING = new Time(2, 0.5, 0.6);
    public static MORNING = new Time(0, 0, 0.1);
    public static NIGHT = new Time(3, 0.6, 1);

    constructor(id: number, start: number, end: number) {
        this.id = id;
        this.startPercent = start;
        this.endPercent = end;
    }

    private readonly endPercent: number;
    private readonly startPercent: number;

    public ratio(): number {
        const S = this.start;
        const E = this.end;
        return (Updater.tickCount - S) / (E - S);
    }

    public get end(): number {
        return Updater.dayLength * this.endPercent;
    }

    public get start(): number {
        return Updater.dayLength * this.startPercent;
    }
}
