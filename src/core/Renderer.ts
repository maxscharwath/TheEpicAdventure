import * as PIXI from "pixi.js";
import Camera from "../gfx/Camera";
import Level from "../level/Level";
import Display from "../screen/Display";
import Color from "../utility/Color";
import Game from "./Game";
import System from "./System";
import {Readable} from "stream";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.settings.ROUND_PIXELS = true;

interface CanvasElement extends HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
}

export default class Renderer {
    public static ticks = 0;

    public static get ZOOM() {
        return 0;
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

    public static delta: number;
    public static readonly DEFAULT_WIDTH: number = 240;
    public static readonly DEFAULT_HEIGHT: number = 160;
    public static WIDTH: number = Renderer.DEFAULT_WIDTH;
    public static HEIGHT: number = Renderer.DEFAULT_HEIGHT;
    public static camera: Camera = new Camera();

    public static render(dlt: number): void {
        const t1 = System.milliTime();
        Renderer.delta = dlt;
        if (!Game.isFocus) {
            return;
        }
        Game.level?.onRender();
        Renderer.camera.update();
        Game.GUI.onRender();
        this.ticks++;
        this.renderer.render(this.mainStage);
        this.ticksTime.unshift(System.milliTime() - t1);
        this.ticksTime.length = Math.min(this.ticksTime.length, 50);
    }

    public static getTickTime(): number {
        return this.ticksTime.reduce((p, c) => p + c, 0) / this.ticksTime.length;
    }

    public static init() {
        document.body.appendChild(this.renderer.view);
        this.mainStage.addChild(this.stages.level);
        this.mainStage.addChild(this.stages.gui);
    }

    public static getScreen() {
        return this.renderer.screen;
    }

    public static setLevel(level: Level) {
        this.stages.level.removeChildren();
        this.stages.level.addChild(level.container);
        if (level.weather) this.stages.level.addChild(level.weather);
        this.stages.level.addChild(level.lightFilter);
        Renderer.camera.setContainer(level.container, level.lightFilter.lightContainer);
    }

    public static addDisplay(display: Display) {
        this.stages.gui.addChild(display);
    }

    public static getNbChildren() {
        const f = (container: PIXI.Container): number => container.children.length === 0 ? 0 :
            container.children.filter((c) => c.isSprite).length +
            container.children.reduce((sum: number, c: PIXI.Container) => (sum + f(c)), 0);
        return f(this.mainStage);
    }

    public static createStream() {
        // const audioStream = Howler.ctx.createMediaStreamDestination();
        // Howler.masterGain.disconnect();
        // Howler.masterGain.connect(audioStream);
        const reader = new Readable({
            read: () => {
            },
        });
        const stream = (this.renderer.view as CanvasElement).captureStream();
        // stream.addTrack(audioStream.stream.getAudioTracks()[0]);
        // @ts-ignore
        const recorder = new MediaRecorder(stream);
        recorder.start(75);
        recorder.ondataavailable = (event: any) => {
            event.data.arrayBuffer().then((buffer: ArrayBuffer) => {
                reader.push(Buffer.from(buffer));
            });
        };
        return reader;
    }
    private static ticksTime: number[] = [];
    private static mainStage = new PIXI.Container();
    private static stages = {
        level: new PIXI.Container(),
        gui: new PIXI.Container(),
    };
    private static renderer = new PIXI.Renderer({
        width: 960,
        height: 540,
        backgroundColor: Color.black.getInt(),
        autoDensity: false,
        antialias: false,
        clearBeforeRender: false,
        powerPreference: "high-performance",
    });
}
