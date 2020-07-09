import * as PIXI from "pixi.js";
import LevelFilter from "./LevelFilter";
import Renderer from "../core/Renderer";
import Updater from "../core/Updater";

export default class LightFilter extends LevelFilter {
    public lightContainer = new PIXI.Container();
    private readonly ambientLight: PIXI.Sprite;
    private readonly blendFilter: PIXI.filters.AlphaFilter;

    constructor() {
        super();

        this.ambientLight = new PIXI.Sprite(PIXI.Texture.WHITE);
        this.ambientLight.width = Renderer.getScreen().width;
        this.ambientLight.height = Renderer.getScreen().height;
        this.ambientLight.tint = 0x000000;

        this.addChild(this.ambientLight, this.lightContainer);

        this.blendFilter = new PIXI.filters.AlphaFilter();
        this.blendFilter.alpha = 0;
        this.blendFilter.blendMode = PIXI.BLEND_MODES.MULTIPLY;

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 10;
        blurFilter.repeatEdgePixels = true;

        this.filters = [blurFilter, this.blendFilter];
    }

    public onRender() {
         // this.blendFilter.alpha = (Math.cos(2 * Math.PI * Updater.getDayRatio()) + 1) / 2;
    }

    protected init() {

    }
}
