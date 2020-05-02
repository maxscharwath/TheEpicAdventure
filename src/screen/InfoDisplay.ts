import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Initializer from "../core/Initializer";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";
import Color from "../utility/Color";
import Display from "./Display";

export default class InfoDisplay extends Display {
    private readonly textArea: PIXI.Text;
    private readonly textBg = new PIXI.Sprite(PIXI.Texture.WHITE);

    private text(): string {
        const tile = Game.player.getTile();
        return [
            `v: ${Game.version.toString()}`,
            `fps: ${Math.round(Initializer.getCurFps())}`,
            `tU: ${Updater.getTickTime().toFixed(2)}ms`,
            `tR: ${Renderer.getTickTime().toFixed(2)}ms`,
            `t: ${Updater.tickCount} (${Updater.time})`,
            `s: ${Game.level.seed}`,
            `x: ${(Game.player.x / 16).toFixed(2)}`,
            `y: ${(Game.player.y / 16).toFixed(2)}`,
            `y: ${(Game.player.a)}`,
            `b: ${tile?.biome.getDisplayName()}`,
            `tt: ${tile?.temperature}`,
            `te: ${tile?.elevation}`,
            `tm: ${tile?.moisture}`,
            `t: ${tile?.tile.getDisplayName()}`,
            `c: ${Renderer.getNbChildren()}`,
            `m: ${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        ].join("\n");
    }

    constructor() {
        super(false);
        this.textArea = new PIXI.Text("", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: Color.white.getInt(),
        });

        this.textArea.x = 0;
        this.textArea.y = 0;

        this.textBg.tint = Color.black.getInt();
        this.textBg.alpha = 0.5;

        this.addChild(this.textBg, this.textArea);
    }

    public onTick(): void {
        const text = this.text();
        if (this.textArea.text === text) {
            return;
        }
        this.textArea.text = text;
        this.textBg.x = this.textArea.x;
        this.textBg.y = this.textArea.y;
        this.textBg.width = this.textArea.width;
        this.textBg.height = this.textArea.height;
    }

    public onRender(): void {
    }
}
