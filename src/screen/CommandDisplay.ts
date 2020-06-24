import * as PIXI from "pixi.js";
import Display from "./Display";
import Updater from "../core/Updater";
import Game from "../core/Game";
import Color from "../utility/Color";
import Renderer from "../core/Renderer";
import Command from "../core/io/Command";

export default class CommandDisplay extends Display {

    public get message() {
        return this.input.value;
    }

    public static createInput() {
        const _commandInput = document.createElement("input");
        _commandInput.id = "command";
        _commandInput.type = "text";
        _commandInput.style.position = "absolute";
        _commandInput.style.left = "-1000px";
        _commandInput.style.top = "-1000px";
        document.body.appendChild(_commandInput);
        return _commandInput;
    }

    public hasCommand = true;
    private inputText: PIXI.BitmapText;
    private cursorStart: number;
    private cursorTicks: number;
    private cursorEnd: number;
    private historicCommand: string[] = [];
    private historicResult: string[] = [];
    private selectIndex: number = 0;
    private input: HTMLInputElement;

    constructor() {
        super();
        this.input = CommandDisplay.createInput();
        this.init();
    }

    public show() {
        super.show();
        this.clear();
        Game.input.preventDefault = false;
    }

    public hide() {
        super.hide();
        this.clear();
        this.input.blur();
        Game.input.preventDefault = true;
    }

    public sendMessage(msg: string) {
        this.historicResult.unshift(msg);
    }

    public execute() {
        if (this.message === "") return false;
        this.selectIndex = 0;
        this.historicCommand.unshift(this.message);
        this.historicResult.unshift(this.message);

        const commands = this.message.split("/");
        commands.shift();
        for (const command of commands) {
            const args = command.split(" ");
            const name = args.shift();
            const result = Command.execute(name, args);
            [].concat(result).forEach((res) => {
                this.historicResult.unshift(res.toString());
            });
        }
        this.clear();
    }

    public onRender() {
        super.onRender();
    }

    public clear() {
        this.input.value = "";
        this.inputText.text = "";
    }

    public onTick() {
        super.onTick();
        while (this.historicResult.length > 15) this.historicResult.pop();
        if (Updater.every(100)) this.historicResult.pop();
        if (this.active) this.input.focus();

        this.inputText.text = [...this.historicResult].reverse().join("\n") + "\n" + ">" + this.message;

        if (!this.active) return;

        if (this.input.selectionStart !== this.cursorStart) {
            this.cursorStart = this.input.selectionStart;
            this.cursorTicks = 0;
        }
        if (this.input.selectionEnd !== this.cursorEnd) {
            this.cursorEnd = this.input.selectionEnd;
        }
    }

    public onCommand() {
        super.onCommand();
        if (Game.input.getKey("EXIT").clicked) this.hide();
        if (!this.active) return;
        if (Game.input.getKey("ENTER").clicked) this.execute();
        if (Game.input.getKey("CURSOR-UP").clicked) {
            if (this.selectIndex < this.historicCommand.length) this.selectIndex++;
            if (this.historicCommand[this.selectIndex - 1]) {
                this.input.value = this.historicCommand[this.selectIndex - 1];
            }
        }
        if (Game.input.getKey("CURSOR-DOWN").clicked) {
            if (this.selectIndex > 1) this.selectIndex--;
            if (this.historicCommand[this.selectIndex - 1]) {
                this.input.value = this.historicCommand[this.selectIndex - 1];
            }
        }
    }

    public isBlocking() {
        return true;
    }

    private init() {
        this.inputText = new PIXI.BitmapText("", {
            fontName: "Epic",
            fontSize: 16,
            tint: Color.white.getInt(),
        });
        this.inputText.anchor = new PIXI.Point(0, 1);
        this.inputText.y = Renderer.getScreen().height;
        this.addChild(this.inputText);
    }
}
