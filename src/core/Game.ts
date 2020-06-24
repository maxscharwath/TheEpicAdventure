import * as PIXI from "pixi.js";
import Items from "../item/Items";
import Crafting from "../crafting/Crafting";
import {Player, Camp, Zombie} from "../entity/";
import Biome from "../level/biome/Biome";
import Level from "../level/Level";
import Client from "../network/Client";
import Server from "../network/Server";
import Version from "../saveload/Version";
import Initializer from "./Initializer";
import InputHandler from "./io/InputHandler";
import Localization from "./io/Localization";
import Network from "./Network";
import Settings from "./Settings";
import System from "./System";
import Renderer from "./Renderer";
import MouseHandler from "./io/MouseHandler";
import GUI from "./GUI";
import Seed from "../utility/Seed";

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
    public static client?: Client;
    public static server?: Server;
    public static running: boolean = true;
    public static levels: Level[] = [];
    public static currentLevel: number = 0;
    public static input: InputHandler;
    public static mouse: MouseHandler;
    public static GUI: GUI;

    public static get level(): Level {
        return this.levels[this.currentLevel];
    }

    public static isValidClient(): boolean {
        return this.isOnline && this.client != null;
    }

    public static isConnectedClient(): boolean {
        return Boolean(this.isValidClient() && this.client?.isConnected());
    }

    public static isValidServer(): boolean {
        return Boolean(this.isOnline && this.isHost && this.server);
    }

    public static hasConnectedClients(): boolean {
        return Boolean(this.isValidServer() && this.server?.hasClients());
    }

    public static main(): void {
        console.info(`\n${this.NAME} ${this.version.toString()}\nA game by Maxime Scharwath\n`);
        Crafting.initRecipes();
        Biome.initBiomeList();
        Localization.loadLanguage("fr-FR.yaml");
        Items.verifyTag();
        this.levels = [];
        this.input = new InputHandler();
        this.mouse = new MouseHandler();
        this.GUI = new GUI();
        this.player = new Player();

        this.levels.push(new Level(Seed.create("maxime")));
        this.level.deleteTempDir();
        this.level.add(this.player, 0, 0, true);
        // this.level.add(new MusicPlayer(), 3, 3, true);
        this.level.add(new Camp(), 2, 5, true);
        for (let i = 0; i < 2; i++) {
            this.level.add(new Zombie(), 0, 2, true);
        }
        Renderer.setLevel(this.level);
        setTimeout(() => {
            this.level.findEntities((entity) => entity.visible).then((entities) => console.log(entities));
        }, 20000);
        Initializer.createAndDisplayFrame();
        Initializer.run();
        Network.startMultiplayerServer();
        PIXI.Loader.shared.add("Epic", System.getResource("font", "Epic.xml")).load(() => {
            this.GUI.init();
        });

        /*        window.addEventListener("beforeunload", (e) => {
                    e.preventDefault();
                    this.quit().finally(() => {
                        remote.getCurrentWindow().destroy();
                    });
                    e.returnValue = true;
                });*/
    }

    public static quit() {
        if (this.isValidServer()) {
            this.server?.endConnection();
        }
        if (this.isConnectedClient()) {
            this.client?.endConnection();
        }
        this.running = false;
        return Promise.all(this.levels.map(((level) => level.save())));
    }
}
