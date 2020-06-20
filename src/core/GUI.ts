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
    private displays: Display[] = [];
    private mainDisplay?: Display;
    private infoDisplay?: InfoDisplay;
    private hotbarDisplay?: HotbarDisplay;
    private dialogueDisplay?: DialogueDisplay;
    private commandDisplay?: CommandDisplay;
    private blocks: boolean = false;

    public init() {
        this.infoDisplay = new InfoDisplay();
        this.hotbarDisplay = new HotbarDisplay(Game.player);
        this.dialogueDisplay = new DialogueDisplay();
        this.commandDisplay = new CommandDisplay();
        new LanDisplay().show();
        new HeartDisplay(Game.player).show();

        this.hotbarDisplay.show();
    }

    public setDisplay(display: Display) {
        if (this.mainDisplay) {
            this.mainDisplay.hide();
        }
        this.mainDisplay = display;
        this.mainDisplay.show();
    }

    public addDisplay(display: Display) {
        if (!this.displays.includes(display)) {
            this.displays.push(display);
        }
    }

    public removeDisplay(display: Display) {
        this.displays.splice(this.displays.indexOf(display));
        if (display === this.mainDisplay) {
            this.mainDisplay = undefined;
        }
    }

    public onRender() {
        this.displays.forEach((display) => {
            display.onRender();
        });
    }

    public isBlocking() {
        return this.blocks;
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
}
