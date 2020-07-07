import * as PIXI from "pixi.js";
import Renderer from "../core/Renderer";

export default class LevelFilter extends PIXI.Container {

    constructor() {
        super();
        this.init();
    }

    protected get cameraX() {
        return Renderer.camera.x * Renderer.camera.zoom;
    }

    protected get cameraY() {
        return Renderer.camera.y * Renderer.camera.zoom;
    }

    public onRender() {

    }

    protected init() {

    }
}
