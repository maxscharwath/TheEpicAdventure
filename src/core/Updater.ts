import Game from "./Game";
import Renderer from "./Renderer";

export default class Updater {
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

    public static tick(dlt: number): void {
        Updater.delta = dlt;
        Game.input.tick();
        if (!Game.HASFOCUS) {
            return;
        }
        Updater.setTime(Updater.tickCount + 1);
        Renderer.camera.update();
        Game.displays.forEach((display) => {
            display.tick();
        });
        Game.level.tick();
    }

    public static setTime(ticks: number): void {
        if (ticks < Updater.Time.Morning) {
            ticks = 0;
        }
        if (ticks < Updater.Time.Day) {
            Updater.time = 0;
        } else if (ticks < Updater.Time.Evening) {
            Updater.time = 1;
        } else if (ticks < Updater.Time.Night) {
            Updater.time = 2;
        } else if (ticks < Updater.dayLength) {
            Updater.time = 3;
        } else {
            Updater.time = 0;
            ticks = 0;
        }
        Updater.tickCount = ticks;
    }
}
