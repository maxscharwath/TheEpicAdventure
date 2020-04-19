import * as PIXI from "pixi.js";
import Game from "../core/Game";
import Renderer from "../core/Renderer";

class DraggableArea extends PIXI.Container {
    private dragging: boolean;
    private data: any;
    private offset: PIXI.Point;
    private parentContainer: PIXI.Container;

    private onDragStart(event: any) {
        this.data = event.data;
        this.offset = this.data.getLocalPosition(this);
        this.alpha = 0.5;
        this.dragging = true;
    }

    private onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }

    private onDragMove() {
        if (this.dragging && this.parent) {
            const newPosition = this.data.getLocalPosition(this.parentContainer.parent);
            this.parentContainer.x = newPosition.x - (this.offset.x * this.scale.x);
            this.parentContainer.y = newPosition.y - (this.offset.y * this.scale.y);
        }
    }

    constructor(parentContainer: PIXI.Container, x= 0, y= 0) {
        super();
        this.x = x;
        this.y = y;
        this.parentContainer = parentContainer;
        this.buttonMode = true;
        this.interactive = true;
        this
            .on("mousedown", this.onDragStart)
            .on("mouseup", this.onDragEnd)
            .on("mouseupoutside", this.onDragEnd)
            .on("mousemove", this.onDragMove);

        this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    }

    public disable() {
        this.interactive = false;
        this.visible = false;
    }

    public enable() {
        this.interactive = true;
        this.visible = false;
    }
}

export default class Display extends PIXI.Container {

    constructor(draggable= false) {
        super();
        if (draggable) {
            this.addChild(new DraggableArea(this, -2, -2));
        }
    }

    public show() {
        Renderer.addDisplay(this);
        if (!Game.displays.includes(this)) {
            Game.displays.push(this);
        }
    }

    public hide() {
        this.parent.removeChild(this);
        Game.displays.splice(Game.displays.indexOf(this));
    }

    public tick(): void {

    }
}
