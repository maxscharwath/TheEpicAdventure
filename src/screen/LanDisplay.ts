import Display from "./Display";
import SearchServer from "../network/SearchServer";
import * as PIXI from "pixi.js";
import Color from "../utility/Color";
import {shell} from "electron";

export default class LanDisplay extends Display {
    constructor() {
        super(true);
    }

    public show() {
        super.show();
        SearchServer.start((server) => {
            const text = new PIXI.BitmapText(`${server.ip}:${server.port}`, {
                font: {name: "Minecraftia", size: 16},
                tint: Color.white.getInt(),
            });
            text.interactive = true;
            text.buttonMode = true;
            text.on("click", () => shell.openExternal(`http://${server.ip}:${server.port}/status`));
            text.y = this.children.length * 20;
            this.addChild(text);
        });
    }

    public hide() {
        super.hide();
        SearchServer.stop();
    }

    public onTick(): void {

    }

    public onRender(): void {
    }
}
