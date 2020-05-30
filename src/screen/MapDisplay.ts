import * as PIXI from "pixi.js";
import Display from "./Display";
import System from "../core/System";
import Renderer from "../core/Renderer";
import Game from "../core/Game";
import Color from "../utility/Color";

export default class MapDisplay extends Display {
    public hasCommand = true;
    private map: PIXI.Sprite;
    private marker: PIXI.Sprite;
    constructor() {
        super();
        this.init();
    }

    public onCommand(): void {
        super.onCommand();
        if (Game.input.getKey("EXIT").clicked) this.hide();
    }

    public onRender() {
        super.onRender();
        let x = (Game.player.x >> 4) * (96 / 128);
        let y = (Game.player.y >> 4) * (96 / 128);
        if (y < 0) y = 0; if (y > 96) y = 96;
        if (x < 0) x = 0; if (x > 96) x = 96;
        this.marker.position.set(x, y);
    }

    private drawCanvas(size= 128) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const setPixel = (x: number, y: number, color: Color) => {
            if (x < 0 || y < 0 || y > size || x > size) return;
            const i = ( y * size + x) * 4;
            imageData.data[i] = color.r;
            imageData.data[i + 1] = color.g;
            imageData.data[i + 2] = color.b;
            imageData.data[i + 3] = 255;
        };
        for (let x = 0; x < (size >> 4); ++x) {
            for (let y = 0; y < (size >> 4); ++y) {
                Game.level.levelGen.genChunk(x, y).forEach((lt) => setPixel(lt.x >> 4, lt.y >> 4, lt.biome.color));
            }
        }
        ctx.putImageData(imageData, 0, 0);
        return PIXI.Texture.from(canvas);
    }

    private init() {
        const container = new PIXI.Container();
        const baseTexture = PIXI.BaseTexture.from(System.getResource("screen", "map.png"));
        const sprite = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(0, 0, 112, 112)));
        this.marker = new PIXI.Sprite(new PIXI.Texture(baseTexture, new PIXI.Rectangle(112, 8, 8, 8)));
        this.marker.anchor.set(0.5);
        this.marker.pivot.set(-8, -8);
        const background = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.map = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.map.texture = this.drawCanvas();
        this.map.width = 96;
        this.map.height = 96;
        this.map.position.set(8, 8);
        background.width = Renderer.getScreen().width;
        background.height = Renderer.getScreen().height;
        background.tint = 0x000000;
        background.alpha = 0.75;
        container.addChild(sprite, this.map, this.marker);
        container.scale.set(4);
        container.position.set(
            (Renderer.getScreen().width - container.width) / 2,
            (Renderer.getScreen().height - container.height) / 2,
        );
        this.addChild(background, container);
    }
}
