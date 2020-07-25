import Game from "./Game";
import System from "./System";

class Time {
    public id: number;
    private readonly startPercent: number;
    private readonly endPercent: number;

    constructor(id: number, start: number, end: number) {
        this.id = id;
        this.startPercent = start;
        this.endPercent = end;
    }

    public get start(): number {
        return Updater.dayLength * this.startPercent;
    }

    public get end(): number {
        return Updater.dayLength * this.endPercent;
    }

    public ratio(): number {
        const S = this.start;
        const E = this.end;
        return (Updater.tickCount - S) / (E - S);
    }
}

export default class Updater {
    public static readonly dayLength: number = 15000;
    public static readonly sleepEndTime: number = Updater.dayLength / 8;
    public static readonly sleepStartTime: number = Updater.dayLength / 2 + Updater.dayLength / 8;
    public static readonly Time = {
        Morning: new Time(0, 0, 0.1),
        Day: new Time(1, 0.1, 0.5),
        Evening: new Time(2, 0.5, 0.6),
        Night: new Time(3, 0.6, 1),
    };
    public static ticks: number = 0;
    public static time: Time = Updater.Time.Morning;
    public static delta: number;
    public static tickCount: number = Updater.Time.Day.start;
    private static ticksTime: number[] = [];

    public static getDayRatio() {
        return this.tickCount / this.dayLength;
    }

    public static onTick(dlt: number): void {
        const t1 = System.milliTime();
        this.delta = dlt;
        if (!Game.isFocus) return;
        Game.GUI.onTick();
        Game.level?.onTick();
        Game.input.onTick();
        Game.mouse.onTick();
        this.setTime(this.tickCount + 1);
        this.ticks++;
        this.ticksTime.unshift(System.milliTime() - t1);
        this.ticksTime.length = Math.min(this.ticksTime.length, 50);
    }

    public static getTickTime(): number {
        return this.ticksTime.reduce((p, c) => p + c, 0) / this.ticksTime.length;
    }

    public static setTime(ticks: number): void {
        if (ticks < this.Time.Morning.start) ticks = 0;
        if (ticks < this.Time.Day.start) {
            this.time = this.Time.Morning;
        } else if (ticks < this.Time.Evening.start) {
            this.time = this.Time.Day;
        } else if (ticks < this.Time.Night.start) {
            this.time = this.Time.Evening;
        } else if (ticks < this.dayLength) {
            this.time = this.Time.Night;
        } else {
            this.time = this.Time.Morning;
            ticks = 0;
        }
        this.tickCount = ticks;
    }

    public static every(tick: number): boolean {
        return (this.tickCount % tick) === 0;
    }
}
