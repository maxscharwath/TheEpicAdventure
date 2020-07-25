import Display from "../screen/Display";
import InfoDisplay from "../screen/InfoDisplay";
import HotbarDisplay from "../screen/HotbaryDisplay";
import LanDisplay from "../screen/LanDisplay";
import DialogueDisplay from "../screen/DialogueDisplay";
import Game from "./Game";
import HeartDisplay from "../screen/HeartDisplay";
import CraftingDisplay from "../screen/CraftingDisplay";
import Crafting from "../crafting/Crafting";
import InventoryDisplay from "../screen/InventoryDisplay";
import MapDisplay from "../screen/MapDisplay";
import CommandDisplay from "../screen/CommandDisplay";

export default class GUI {
    private blocks: boolean = false;
    private commandDisplay?: CommandDisplay;
    private dialogueDisplay?: DialogueDisplay;
    private displays: Array<Display> = [];
    private hotbarDisplay?: HotbarDisplay;
    private infoDisplay?: InfoDisplay;
    private mainDisplay?: Display;

    public addDisplay(display: Display) {
        if (!this.displays.includes(display)) {
            this.displays.push(display);
        }
    }

    public init() {
        this.infoDisplay = new InfoDisplay();
        this.hotbarDisplay = new HotbarDisplay();
        this.dialogueDisplay = new DialogueDisplay();
        this.commandDisplay = new CommandDisplay();
        new LanDisplay().show();
        new HeartDisplay().show();

        this.hotbarDisplay.show();
    }

    public isBlocking() {
        return this.blocks;
    }

    public onRender() {
        this.displays.forEach((display) => {
            display.onRender();
        });
    }

    public onResize() {
        this.displays.forEach((display) => {
            display.onResize();
        });
    }

    public onTick() {
        this.blocks = false;
        this.displays.forEach((display, index) => {
            display.onTick();
            if (display.isBlocking()) this.blocks = true;
            if (index === this.displays.length - 1) {
                display.onCommand();
            }
        });
        if (this.blocks) return;
        if (Game.input.getKey("INFO").clicked) {
            this.infoDisplay?.toggle();
        }
        if (Game.input.getKey("CHAT").clicked) {
            this.commandDisplay?.toggle();
        }
        if (Game.input.getKey("CRAFT").clicked) {
            this.setDisplay(new CraftingDisplay(Crafting.allRecipes, Game.player));
        }
        if (Game.input.getKey("INVENTORY").clicked) {
            this.setDisplay(new InventoryDisplay(Game.player.inventory));
        }
        if (Game.input.getKey("MAP").clicked) {
            this.setDisplay(new MapDisplay());
        }
    }

    public removeDisplay(display: Display) {
        this.displays.splice(this.displays.indexOf(display));
        if (display === this.mainDisplay) {
            this.mainDisplay = undefined;
        }
    }

    public setDisplay(display: Display) {
        if (this.mainDisplay) {
            this.mainDisplay.hide();
        }
        this.mainDisplay = display;
        this.mainDisplay.show();
    }
}
