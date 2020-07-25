import * as PIXI from "pixi.js";
import Display from "./Display";

class DraggableArea extends PIXI.Container {

    constructor(parentContainer: PIXI.Container, x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
        this.parentContainer = parentContainer;
        this.buttonMode = true;
        this.interactive = true;
        this.interactiveChildren = true;
        this
            .on("mousedown", this.onDragStart)
            .on("mouseup", this.onDragEnd)
            .on("mouseupoutside", this.onDragEnd)
            .on("mousemove", this.onDragMove);

        this.addChild(new PIXI.Sprite(PIXI.Texture.WHITE));
    }
    private data: any;
    private dragging: boolean = false;
    private offset = new PIXI.Point();
    private parentContainer: PIXI.Container;

    public disable() {
        this.interactive = false;
        this.visible = false;
    }

    public enable() {
        this.interactive = true;
        this.visible = false;
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

    private onDragStart(event: any) {
        this.data = event.data;
        this.offset = this.data.getLocalPosition(this);
        this.alpha = 0.5;
        this.dragging = true;
    }
}

export default class DraggableDisplay extends Display {
    constructor() {
        super();
        this.addChild(new DraggableArea(this, -2, -2));
    }
}
