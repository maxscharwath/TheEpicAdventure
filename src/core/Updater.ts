import Game from "./Game";
import System from "./System";

export default class Updater {
    private static ticksTime: number[] = [];
    public static readonly normSpeed: number = 60;
    public static gamespeed: number = 1;
    public static paused: boolean = true;

    public static tickCount: number = 0;
    public static time: number = 0;
    public static readonly dayLength: number = 3600;
    public static readonly sleepEndTime: number = Updater.dayLength / 8;
    public static readonly sleepStartTime: number = Updater.dayLength / 2 + Updater.dayLength / 8;

    public static readonly Time = {
        Morning: 0,
        Day: Updater.dayLength / 4,
        Evening: Updater.dayLength / 2,
        Night: Updater.dayLength / 4 * 3,
    };
    public static delta: number;

    public static onTick(dlt: number): void {
        const t1 = System.milliTime();
        this.delta = dlt;
        Game.input.onTick();
        if (!Game.HASFOCUS) {
            return;
        }
        Game.displays.forEach((display) => {
            display.onTick();
        });
        Game.level.onTick();
        this.setTime(this.tickCount + 1);
        this.ticksTime.unshift(System.milliTime() - t1);
        this.ticksTime.length = Math.min(this.ticksTime.length, 50);
    }

    public static getTickTime(): number {
        return this.ticksTime.reduce((p, c) => p + c, 0) / this.ticksTime.length;
    }

    public static setTime(ticks: number): void {
        if (ticks < this.Time.Morning) {
            ticks = 0;
        }
        if (ticks < this.Time.Day) {
            this.time = 0;
        } else if (ticks < this.Time.Evening) {
            this.time = 1;
        } else if (ticks < this.Time.Night) {
            this.time = 2;
        } else if (ticks < this.dayLength) {
            this.time = 3;
        } else {
            this.time = 0;
            ticks = 0;
        }
        this.tickCount = ticks;
    }

    public static every(tick: number): boolean {
        return (this.tickCount % tick) === 0;
    }
}
