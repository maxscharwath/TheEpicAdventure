import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Initializer from "../core/Initializer";
import Updater from "../core/Updater";
import Color from "../utility/Color";
import Display from "./Display";

export default class InfoDisplay extends Display {
    private readonly textArea: PIXI.Text;
    private readonly textBg = new PIXI.Sprite(PIXI.Texture.WHITE);

    constructor() {
        super();
        this.textArea = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: Color.white.getInt(),
        });

        this.textArea.x = 0;
        this.textArea.y = 0;

        this.textBg.tint = Color.black.getInt();
        this.textBg.alpha = 0.5;

        this.container.addChild(this.textBg, this.textArea);
    }

    public tick(): void {
        const text = this.text();
        if (this.textArea.text === text) {
            return;
        }
        this.textArea.text = text;

        const b = this.textArea.getBounds();
        this.textBg.x = b.x;
        this.textBg.y = b.y;
        this.textBg.width = b.width;
        this.textBg.height = b.height;
    }

    private text(): string {
        const tile = Game.player.getTile();
        return [
            `fps: ${Math.round(Initializer.getCurFps())}`,
            `t: ${Updater.tickCount} (${Updater.time})`,
            `s: ${Game.level.seed}`,
            `x: ${(Game.player.x / 16).toFixed(2)}`,
            `y: ${(Game.player.y / 16).toFixed(2)}`,
            `b: ${tile.biome.getDisplayName()}`,
            `t: ${tile.tile.getDisplayName()}`,
        ].join("\n");
    }
}
