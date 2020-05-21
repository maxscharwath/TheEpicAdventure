import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Renderer from "../core/Renderer";

export default class Display extends PIXI.Container {

    constructor() {
        super();
    }

    public show() {
        Renderer.addDisplay(this);
        if (!Game.displays.includes(this)) {
            Game.displays.push(this);
        }
    }

    public hide() {
        this.parent.removeChild(this);
        Game.displays.splice(Game.displays.indexOf(this));
    }

    public onRender(): void {

    }

    public onTick(): void {

    }
}
