export default class Key {
    public clicked: boolean = false;

    public down: boolean = false;
    public sticky: boolean = false;

    constructor(stayDown: boolean = false) {
        this.stayDown = stayDown;
    }
    private absorbs: number = 0;
    private presses: number = 0;
    private stayDown: boolean = false;

    public onTick(): void {
        if (this.absorbs < this.presses) {
            this.absorbs++;
            if (this.presses - this.absorbs > 3) {
                this.absorbs = this.presses - 3;
            }
            this.clicked = true;
        } else {
            if (!this.sticky) {
                this.sticky = this.presses > 3;
            } else {
                this.sticky = this.down;
            }
            this.clicked = this.sticky;
            this.presses = 0;
            this.absorbs = 0;
        }
    }

    public release(): void {
        this.down = false;
        this.clicked = false;
        this.presses = 0;
        this.absorbs = 0;
        this.sticky = false;
    }

    public toggle(pressed: boolean): void {
        this.down = pressed;
        if (pressed && !this.sticky) {
            this.presses++;
        }
    }

    public toString(): string {
        return `down: ${this.down}; clicked: ${this.clicked}; presses=${this.presses}; absorbs=${this.absorbs};`;
    }
}
