import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Renderer from "../core/Renderer";

export default class Display extends PIXI.Container {
    public active: boolean = false;
    public hasCommand = false;

    constructor() {
        super();
    }

    public hide() {
        this.active = false;
        this.parent.removeChild(this);
        Game.GUI.removeDisplay(this);
    }

    public isBlocking() {
        return false;
    }

    public onCommand(): void {

    }

    public onRender(): void {

    }

    public onResize(): void {

    }

    public onTick(): void {

    }

    public show() {
        this.active = true;
        Renderer.addDisplay(this);
        Game.GUI.addDisplay(this);
    }

    public toggle() {
        if (this.active) {
            this.hide();
        } else {
            this.show();
        }
    }
}
