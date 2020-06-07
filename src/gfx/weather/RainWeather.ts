import Weather from "./Weather";
import * as PIXI from "pixi.js";
import System from "../../core/System";
import Renderer from "../../core/Renderer";

export default class RainWeather extends Weather {
    private layers: PIXI.TilingSprite[];
    private tint: PIXI.Sprite;
    private offset: PIXI.Point;

    public onRender() {
        super.onRender();
        const x = Renderer.camera.x * Renderer.camera.zoom;
        const y = Renderer.camera.y * Renderer.camera.zoom;
        this.offset.y += 20;
        for (const layer of this.layers) {
            layer.width = Renderer.getScreen().width;
            layer.height = Renderer.getScreen().height;
            layer.tilePosition.y = -y + this.offset.y / layer.zIndex;
            layer.tilePosition.x = -x + this.offset.x / layer.zIndex;
            layer.tileScale.set(4 / layer.zIndex);
        }
    }
    protected init() {
        super.init();
        const texture = PIXI.Texture.from(System.getResource("weather", "rain.png"));
        this.layers = [
            new PIXI.TilingSprite(texture),
            new PIXI.TilingSprite(texture),
            new PIXI.TilingSprite(texture),
        ];
        this.tint = new PIXI.Sprite(PIXI.Texture.WHITE);

        this.layers[0].zIndex = 1;
        this.layers[1].zIndex = 1.5;
        this.layers[2].zIndex = 2;
        this.offset = new PIXI.Point();
        this.tint.width = Renderer.getScreen().width;
        this.tint.height = Renderer.getScreen().height;
        this.tint.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        this.tint.alpha = 0.75;
        this.tint.tint = 0x003ae0;
        this.addChild(this.tint, ...this.layers);
    }
}
