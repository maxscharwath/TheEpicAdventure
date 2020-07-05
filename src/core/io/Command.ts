import Entities from "../../entity/Entities";
import Game from "../Game";
import {clipboard} from "electron";
import Initializer from "../Initializer";


export default class Command {

    public static execute(commandName: string, args: any[]= []): any {
        if (!this.commandList.has(commandName)) return `"${commandName}" unknown`;
        return this.commandList.get(commandName).execute(args);
    }

    public static add(commandName: string) {
        return new Command(commandName);
    }

    private static commandList: Map<string, Command> = new Map<string, Command>();
    private name: string;
    private callback?: (args: any[]) => any;
    constructor(commandName: string) {
        this.name = commandName;
        Command.commandList.set(commandName, this);
    }

    public addFunction(callback: (args: any[]) => any) {
        if (callback instanceof Function) {
            this.callback = callback;
            return true;
        }
        return false;
    }

    public execute(args: any[] = []) {
        if (this.callback instanceof Function) {
            return this.callback(args);
        }
        return false;
    }
}

Command.add("hello").addFunction(() => "world");
Command.add("summon").addFunction((args) => {
    const entityClass = Entities.getByTag(args[0]);
    if (entityClass) {
        Game.level.add(new entityClass());
        return `Summon ${entityClass.name}`;
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
    if (isNaN(speed))speed = 1;
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

Command.add("refresh").addFunction((args) => {
    Game.level.flushChunks();
    return "pending...";
});

Command.add("setLevel").addFunction((args) => {
    const id = parseInt(args[0], 10);
    Game.changeLevel(id);
    return `Set level to ${id}`;
});
