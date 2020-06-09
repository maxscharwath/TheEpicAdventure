import Display from "../screen/Display";
import InfoDisplay from "../screen/InfoDisplay";
import HotbarDisplay from "../screen/HotbaryDisplay";
import LanDisplay from "../screen/LanDisplay";
import DialogueDisplay, {Dialogue} from "../screen/DialogueDisplay";
import Game from "./Game";
import HeartDisplay from "../screen/HeartDisplay";
import CraftingDisplay from "../screen/CraftingDisplay";
import Crafting from "../crafting/Crafting";
import InventoryDisplay from "../screen/InventoryDisplay";
import MapDisplay from "../screen/MapDisplay";

export default class GUI {
    private displays: Display[] = [];
    private mainDisplay?: Display;
    private infoDisplay?: InfoDisplay;
    private hotbarDisplay?: HotbarDisplay;
    private dialogueDisplay?: DialogueDisplay;

    public init() {
        this.infoDisplay = new InfoDisplay();
        this.hotbarDisplay = new HotbarDisplay(Game.player);
        this.dialogueDisplay = new DialogueDisplay();
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

    public hasDisplayOpen(): boolean {
        return this.mainDisplay instanceof Display;
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

    public onTick() {
        this.displays.forEach((display) => display.onTick());
        this.displays.filter((d) => d.hasCommand).reverse()[0]?.onCommand();
        if (Game.input.getKey("INFO").clicked) {
            this.infoDisplay?.toggle();
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
