import * as PIXI from "pixi.js";
import Game from "./Game";
import Renderer from "./Renderer";
import Updater from "./Updater";

export default class Initializer {

    private static tickerRender: PIXI.Ticker = new PIXI.Ticker();
    private static tickerUpdater: PIXI.Ticker = new PIXI.Ticker();

    public static getCurFps(): number {
        return this.tickerRender.FPS;
    }

    public static createAndDisplayFrame(): void {
        Game.HASFOCUS = true;
        window.onblur = () => Game.HASFOCUS = false;
        window.onfocus = () => Game.HASFOCUS = true;
        document.title = Game.NAME + " v" + Game.VERSION.toString();
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
}


