import * as PIXI from "pixi.js";
import Camera from "../gfx/Camera";
import Level from "../level/Level";
import Display from "../screen/Display";
import Color from "../utility/Color";
import Game from "./Game";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
export default class Renderer {

    public static get ZOOM() {
        return 0;
    }

    public static set ZOOM(zoom) {

    }

    public static get REAL_WIDTH() {
        return this.WIDTH * this.ZOOM;
    }

    public static get REAL_HEIGHT() {
        return this.HEIGHT * this.ZOOM;
    }

    public static get clientRect(): any {
        return null;
    }

    public static get xScroll() {
        return (this.camera.x - this.WIDTH / this.camera.zoom / 2);
    }

    public static get yScroll() {
        return (this.camera.y - this.HEIGHT / this.camera.zoom / 2);
    }

    public static readonly DEFAULT_WIDTH: number = 240;
    public static readonly DEFAULT_HEIGHT: number = 160;
    public static WIDTH: number = Renderer.DEFAULT_WIDTH;
    public static HEIGHT: number = Renderer.DEFAULT_HEIGHT;
    public static camera: Camera = new Camera();

    public static setResolution(zoom: number) {
        this.ZOOM = zoom;
    }

    public static setScreenSize(width: number, height: number) {
        this.ZOOM = ~~(height / this.DEFAULT_HEIGHT);
        this.WIDTH = ~~(width / this.ZOOM);
        this.HEIGHT = ~~(height / this.ZOOM);
    }

    public static render(dlt: number): void {
        if (Game.isValidServer()) {
            return;
        }
        Game.level.render();
        this.mainStage.addChild(...this.stages);
        this.renderer.render(this.mainStage);

    }

    public static init() {
        document.body.appendChild(this.renderer.view);
    }

    public static getScreen() {
        return this.renderer.screen;
    }

    public static setLevel(level: Level) {
        this.stages[0].removeChildren();
        this.stages[0].addChild(level.container);
    }

    public static addDisplay(display: Display) {
        this.stages[1].addChild(display.container);
    }
    private static mainStage = new PIXI.Container();
    private static stages: PIXI.Container[] = new Array(3).fill(new PIXI.Container());
    private static DEBUG = false;
    private static nbCanvas = 0;
    private static renderer = new PIXI.Renderer({
        width: 960,
        height: 540,
        backgroundColor: Color.black.getInt(),
        autoDensity: true,
        resolution: 2,
    });
}
