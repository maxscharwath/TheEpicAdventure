export default class Key {

    public down: boolean = false;
    public clicked: boolean = false;
    public sticky: boolean = false;
    private presses: number;
    private absorbs: number;
    private stayDown: boolean = false;

    constructor(stayDown: boolean = false) {
        this.stayDown = stayDown;
    }

    public toggle(pressed: boolean): void {
        this.down = pressed;
        if (pressed && !this.sticky) {
            this.presses++;
        }
    }

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

    public toString(): string {
        return `down: ${this.down}; clicked: ${this.clicked}; presses=${this.presses}; absorbs=${this.absorbs};`;
    }
}
