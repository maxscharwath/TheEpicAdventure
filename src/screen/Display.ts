import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Renderer from "../core/Renderer";

export default class Display extends PIXI.Container {
    public hasCommand = false;
    public active: boolean = false;

    constructor() {
        super();
    }

    public show() {
        this.active = true;
        Renderer.addDisplay(this);
        Game.GUI.addDisplay(this);
    }

    public hide() {
        this.active = false;
        this.parent.removeChild(this);
        Game.GUI.removeDisplay(this);
    }

    public toggle() {
        if (this.active) {
            this.hide();
        } else {
            this.show();
        }
    }

    public onRender(): void {

    }

    public onTick(): void {

    }

    public onCommand(): void {

    }

    public isBlocking() {
        return false;
    }
}
