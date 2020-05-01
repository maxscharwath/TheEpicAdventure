import * as PIXI from "pixi.js";
import Camera from "../gfx/Camera";
import Level from "../level/Level";
import Display from "../screen/Display";
import Color from "../utility/Color";
import Game from "./Game";
import System from "./System";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;
export default class Renderer {
    private static ticksTime: number[] = [];

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

    private static mainStage = new PIXI.Container();
    private static stages: PIXI.Container[] = new Array(3).fill(new PIXI.Container());
    private static DEBUG = false;
    private static nbCanvas = 0;
    private static renderer = new PIXI.Renderer({
        width: 960,
        height: 540,
        backgroundColor: Color.black.getInt(),
        autoDensity: false,
        antialias: false,
        clearBeforeRender: false,
        powerPreference: "high-performance",
    });
    public static delta: number;

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
        const t1 = System.milliTime();
        Renderer.delta = dlt;
        if (!Game.HASFOCUS) {
            return;
        }
        Game.level.onRender();
        Renderer.camera.update();
        Game.displays.forEach((display) => {
            display.onRender();
        });
        this.renderer.render(this.mainStage);
        this.ticksTime.unshift(System.milliTime() - t1);
        this.ticksTime.length = Math.min(this.ticksTime.length, 50);
    }

    public static getTickTime(): number {
        return this.ticksTime.reduce((p, c) => p + c, 0) / this.ticksTime.length;
    }

    public static init() {
        document.body.appendChild(this.renderer.view);
        this.mainStage.addChild(...this.stages);
    }

    public static getScreen() {
        return this.renderer.screen;
    }

    public static setLevel(level: Level) {
        this.stages[0].removeChildren();
        this.stages[0].addChild(level.container);
    }

    public static addDisplay(display: Display) {
        this.stages[1].addChild(display);
    }

    public static getNbChildren() {
        const f = (container: PIXI.Container): number => container.children.length === 0 ? 0 :
            container.children.length + container.children.reduce((sum: number, c: PIXI.Container) => (sum + f(c)), 0);
        return f(this.mainStage);
    }
}
