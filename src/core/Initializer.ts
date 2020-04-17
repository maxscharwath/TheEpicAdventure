import * as PIXI from "pixi.js";
import Game from "./Game";
import Renderer from "./Renderer";
import Updater from "./Updater";

export default class Initializer {

    public static getCurFps(): number {
        return this.ticker.FPS;
    }

    public static createAndDisplayFrame(): void {
        Game.HASFOCUS = true;
        window.onblur = () => Game.HASFOCUS = false;
        window.onfocus = () => Game.HASFOCUS = true;
        document.title = Game.NAME + " v" + Game.VERSION.toString();
        Renderer.init();
    }

    public static run() {
        this.ticker.add((dlt) => Renderer.render(dlt), PIXI.UPDATE_PRIORITY.INTERACTION);
        this.ticker.add((dlt) => Updater.tick(dlt), PIXI.UPDATE_PRIORITY.NORMAL);
        this.ticker.start();
    }

    private static ticker: PIXI.Ticker = new PIXI.Ticker();
}


