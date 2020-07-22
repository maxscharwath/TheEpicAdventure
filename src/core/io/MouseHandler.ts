export default class MouseHandler {
    public deltaX: number = 0;
    public deltaY: number = 0;
    public deltaZ: number = 0;

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

