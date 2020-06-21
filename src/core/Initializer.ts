import * as PIXI from "pixi.js";
import WebFont from "webfontloader";
import Game from "./Game";
import Renderer from "./Renderer";
import System from "./System";
import Updater from "./Updater";

export default class Initializer {

    public static getCurFps(): number {
        return this.tickerRender.FPS;
    }

    public static createAndDisplayFrame(): void {
        Game.isFocus = true;
        window.onblur = () => Game.isFocus = false;
        window.onfocus = () => Game.isFocus = true;
        document.title = Game.NAME + " v" + Game.version.toString();
        Renderer.init();
    }

    public static run() {
        this.tickerRender.add((dlt) => Renderer.render(dlt), PIXI.UPDATE_PRIORITY.INTERACTION);
        this.tickerUpdater.add((dlt) => Updater.onTick(dlt), PIXI.UPDATE_PRIORITY.LOW);
        this.tickerUpdater.minFPS = 20;
        this.tickerUpdater.maxFPS = 20;
        this.tickerRender.start();
        this.tickerUpdater.start();
    }

    public static setSpeed(speed: number) {
        this.tickerUpdater.speed = speed;
    }

    private static tickerRender: PIXI.Ticker = new PIXI.Ticker();
    private static tickerUpdater: PIXI.Ticker = new PIXI.Ticker();
}


