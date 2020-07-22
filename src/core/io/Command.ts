import Entities from "../../entity/Entities";
import Game from "../Game";
import {clipboard, remote} from "electron";
import Initializer from "../Initializer";
import System from "../System";
import CommandDisplay from "../../screen/CommandDisplay";


export default class Command {

    public static execute(display: CommandDisplay, commandName: string, args: any[] = []): any {
        const command = this.commandList.get(commandName);
        if (!command) return `"${commandName}" unknown`;
        return command.execute(args, display);
    }

    public static add(commandName: string) {
        return new Command(commandName);
    }

    private static commandList: Map<string, Command> = new Map<string, Command>();
    private name: string;
    private callback?: (args: any[], display: CommandDisplay) => any;

    constructor(commandName: string) {
        this.name = commandName;
        Command.commandList.set(commandName, this);
    }

    public addFunction(callback: (args: any[], display: CommandDisplay) => any) {
        if (callback instanceof Function) {
            this.callback = callback;
            return true;
        }
        return false;
    }

    public execute(args: any[] = [], display: CommandDisplay) {
        if (this.callback instanceof Function) {
            return this.callback(args, display);
        }
        return false;
    }
}

Command.add("hello").addFunction(() => "world");

Command.add("summon").addFunction((args) => {
    const entityClass = Entities.getByTag(args[0]);
    if (entityClass) {
        const nb = isNaN(parseInt(args[1], 10)) ? 1 : parseInt(args[1], 10);
        for (let i = 0; i < nb; i++) {
            Game.level.add(new entityClass(), Game.player.x, Game.player.y);
        }
        return `Summon ${nb} ${entityClass.name}`;
    }
    return false;
});

Command.add("seed").addFunction(() => {
    const seed = Game.level.seed.toString();
    clipboard.writeText(seed);
    return seed;
});

Command.add("speed").addFunction((args) => {
    let speed = parseInt(args[0], 10);
    if (isNaN(speed)) speed = 1;
    Initializer.setSpeed(speed);
    return speed;
});

Command.add("tp").addFunction((args) => {
    const x = parseInt(args[0], 10);
    const y = parseInt(args[1], 10);
    Game.player.x = x << 4;
    Game.player.y = y << 4;
    return `Teleported to ${x} ${y}`;
});

Command.add("refresh").addFunction((args, display) => {
    Game.level.flushChunks().then(() => {
        display.sendMessage("done");
    });
    return "pending...";
});

Command.add("setLevel").addFunction((args) => {
    const id = parseInt(args[0], 10);
    Game.changeLevel(id);
    return `Set level to ${id}`;
});

Command.add("folder").addFunction(() => {
    remote.shell.showItemInFolder(System.getAppData("tmp"));
    return "";
});
