export default class System {

    private static startTime = new Date().getTime();

    private static now(): number {
        const hr = process.hrtime();
        return (hr[0] * 1e9 + hr[1]) / 1e3;
    }

    public static nanoTime(): number {
        return System.now() * 1000;
    }

    public static startTimeMillis(): number {
        return (new Date()).getTime() - System.startTime;
    }

    public static currentTimeMillis(): number {
        return (new Date()).getTime();
    }
}
