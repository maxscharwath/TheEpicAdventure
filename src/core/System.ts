import * as electron from "electron";
import path from "path";

export default class System {

    public static appData: string = (electron.app || electron.remote.app).getPath("userData");
    public static resources: string = path.dirname(require.main.filename);

    public static milliTime(): number {
        const hr = process.hrtime();
        return hr[0] * 1e3 + hr[1] / 1e6;
    }

    public static microTime(): number {
        const hr = process.hrtime();
        return hr[0] * 1e6 + hr[1] / 1e3;
    }

    public static nanoTime(): number {
        const hr = process.hrtime();
        return hr[0] * 1e9 + hr[1];
    }

    public static getAppData(...url: string[]): string {
        return path.join(this.appData, ...url);
    }

    public static getResource(...url: string[]): string {
        return path.join(this.resources, ...url);
    }

    public static startTimeMillis(): number {
        return this.currentTimeMillis() - System.startTime;
    }

    public static currentTimeMillis(): number {
        return (new Date()).getTime();
    }

    private static startTime = new Date().getTime();
}
