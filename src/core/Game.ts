import Player from "../entity/mob/Player";
import Zombie from "../entity/mob/Zombie";
import ItemEntity from "../entity/ItemEntity";
import ResourceItem from "../item/ResourceItem";
import Resource from "../item/resources/Resource";
import Biome from "../level/biome/Biome";
import Level from "../level/Level";
import Tiles from "../level/tile/Tiles";
import Client from "../network/Client";
import Server from "../network/Server";
import Version from "../saveload/Version";
import BackgroundDisplay from "../screen/BackgroundDisplay";
import Display from "../screen/Display";
import InfoDisplay from "../screen/InfoDisplay";
import InventoryDisplay from "../screen/InventoryDisplay";
import Initializer from "./Initializer";
import InputHandler from "./io/InputHandler";
import Localization from "./io/Localization";
import Settings from "./Settings";

export default class Game {
    public static player: Player;
    public static DEBUG: boolean = true;
    public static HAS_GUI: boolean = true;
    public static readonly NAME: string = "The Epic Adventure";
    public static readonly VERSION: Version = new Version("0.1-dev1");
    public static MAX_FPS: number = Settings.get("fps") as number;
    public static ISONLINE: boolean = false;
    public static ISHOST: boolean = false;
    public static HASFOCUS: boolean = false;
    public static client: Client = null;
    public static server: Server = null;
    public static running: boolean = true;
    public static levels: Level[] = [];
    public static currentLevel: number = 0;
    public static input: InputHandler;
    public static displays: Display[] = [];

    public static get level(): Level {
        return this.levels[this.currentLevel];
    }

    public static isValidClient(): boolean {
        return this.ISONLINE && this.client != null;
    }

    public static isConnectedClient(): boolean {
        return this.isValidClient() && this.client.isConnected();
    }

    public static isValidServer(): boolean {
        return this.ISONLINE && this.ISHOST && this.server != null;
    }

    public static hasConnectedClients(): boolean {
        return this.isValidServer() && this.server.hasClients();
    }

    public static main(): void {
        console.info(`\n${this.NAME} ${this.VERSION.toString()}\nA game by Maxime Scharwath\n`);
        Tiles.initTileList();
        Biome.initBiomeList();
        Localization.loadLanguage("en-US.yaml");
        this.levels = [
            new Level(),
        ];
        this.input = new InputHandler();
        this.player = new Player();
        this.level.add(this.player, 0, 0, true);

        for (let i = 0; i < 0; i++) {
            this.level.add(new Zombie(), 0, 0, true);
        }
        for (let i = 0; i < 100; i++) {
            this.level.add(new ItemEntity(new ResourceItem(new Resource("apple", "src/resources/items/apple.png"))),
                0, 0, true);
        }

        // (new InfoDisplay()).show();
        (new InventoryDisplay(this.player.inventory)).show();

        Initializer.createAndDisplayFrame();
        Initializer.run();
    }

    public static quit(): void {
        if (this.isValidServer()) {
            this.server.endConnection();
        }
        if (this.isConnectedClient()) {
            this.client.endConnection();
        }
        this.running = false;
    }
}
