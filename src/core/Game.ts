import * as PIXI from "pixi.js";
import Items from "../item/Items";
import {Chicken, Player, Chest, Bed, Zombie, Skeleton} from "../entity/";
import Biome from "../level/biome/Biome";
import Level from "../level/Level";
import Client from "../network/Client";
import Server from "../network/Server";
import Version from "../saveload/Version";
import Display from "../screen/Display";
import HotbarDisplay from "../screen/HotbaryDisplay";
import InfoDisplay from "../screen/InfoDisplay";
import Initializer from "./Initializer";
import InputHandler from "./io/InputHandler";
import Localization from "./io/Localization";
import Network from "./Network";
import Settings from "./Settings";
import System from "./System";
import SearchServer from "../network/SearchServer";

export default class Game {
    public static player: Player;
    public static DEBUG: boolean = true;
    public static HAS_GUI: boolean = true;
    public static readonly NAME: string = "The Epic Adventure";
    public static readonly version: Version = new Version("0.1-dev2");
    public static maxFPS: number = Settings.get("fps") as number;
    public static isOnline: boolean = false;
    public static isHost: boolean = false;
    public static isFocus: boolean = false;
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
        return this.isOnline && this.client != null;
    }

    public static isConnectedClient(): boolean {
        return this.isValidClient() && this.client.isConnected();
    }

    public static isValidServer(): boolean {
        return this.isOnline && this.isHost && this.server != null;
    }

    public static hasConnectedClients(): boolean {
        return this.isValidServer() && this.server.hasClients();
    }

    public static main(): void {
        console.info(`\n${this.NAME} ${this.version.toString()}\nA game by Maxime Scharwath\n`);
        Biome.initBiomeList();
        Localization.loadLanguage("fr-FR.yaml");
        Items.verifyTag();
        this.levels = [
            new Level(),
        ];
        this.input = new InputHandler();
        this.player = new Player();
        this.level.deleteTempDir();
        this.level.addEntity(this.player, 0, 0, true);
        this.level.addEntity(new Chest(), 5, 2, true);
        this.level.addEntity(new Bed(), 7, 2, true);
        for (let i = 0; i < 3; i++) {
            this.level.addEntity(new Chicken(), 0, 0, true);
            this.level.addEntity(new Zombie(), 0, 0, true);
            this.level.addEntity(new Skeleton(), 0, 0, true);
        }
        Initializer.run();
        Initializer.createAndDisplayFrame();
        Network.startMultiplayerServer();
        SearchServer.search().then((server) => console.log(server));

        PIXI.Loader.shared.add("Minecraftia", System.getResource("font", "font.xml")).load(() => {
            (new InfoDisplay()).show();
            (new HotbarDisplay(this.player)).show();
        });
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
