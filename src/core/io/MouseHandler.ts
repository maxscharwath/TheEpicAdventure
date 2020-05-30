export default class MouseHandler {
    public deltaX: number;
    public deltaY: number;
    public deltaZ: number;

    constructor() {
        document.addEventListener("wheel", (e) => this.onwheel(e), {passive: false});
    }

    public onTick() {
        this.deltaX = 0;
        this.deltaY = 0;
        this.deltaZ = 0;
    }

    private onwheel(e: WheelEvent) {
        e.preventDefault();
        this.deltaX = e.deltaX;
        this.deltaY = e.deltaY;
        this.deltaZ = e.deltaZ;
    }
}

