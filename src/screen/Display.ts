import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";

export default class Display {

    public container = new PIXI.Container();

    public show() {
        Renderer.addDisplay(this);
    }

    public hide() {
        this.container.parent.removeChild(this.container);
    }

    public tick(): void {

    }
}
