import Game from "../Game";
import Key from "./Key";
import "./String";

export default class InputHandler {

    private static isMod(keyname: string): boolean {
        keyname = keyname.toUpperCase();
        return keyname.equals("SHIFT-LEFT") || keyname.equals("CONTROL-LEFT") || keyname.equals("ALT-LEFT");
    }

    private keymap = new Map();
    private keyboard = new Map();

    private initKeyMap(): void {
        this.keymap.set("MOVE-UP", "KEY-W|ARROW-UP");
        this.keymap.set("MOVE-DOWN", "KEY-S|ARROW-DOWN");
        this.keymap.set("MOVE-LEFT", "KEY-A|ARROW-LEFT");
        this.keymap.set("MOVE-RIGHT", "KEY-D|ARROW-RIGHT");

        this.keymap.set("JUMP", "SPACE");

        this.keymap.set("CURSOR-UP", "ARROW-UP");
        this.keymap.set("CURSOR-DOWN", "ARROW-DOWN");
        this.keymap.set("CURSOR-LEFT", "ARROW-LEFT");
        this.keymap.set("CURSOR-RIGHT", "ARROW-RIGHT");

        this.keymap.set("SELECT", "ENTER");
        this.keymap.set("EXIT", "ESCAPE");

        this.keymap.set("ATTACK", "KEY-C|ENTER");
        this.keymap.set("MENU", "KEY-X|KEY-E");
        this.keymap.set("CRAFT", "KEY-Z|SHIFT-LEFT&KEY-E");
        this.keymap.set("PICKUP", "KEY-V|KEY-P");
        this.keymap.set("DROP-ONE", "KEY-Q");
        this.keymap.set("DROP-STACK", "SHIFT-LEFT&KEY-Q");

        this.keymap.set("PAUSE", "ESCAPE");

        this.keymap.set("EXIT", "ESCAPE");
        this.keymap.set("POTIONEFFECTS", "KEY-P");
        this.keymap.set("INFO", "SHIFT-LEFT&KEY-I");
        this.keymap.set("QUIT", "CONTROL-LEFT&KEY-Q");
    }


    private toggle(keyCode: string, pressed: boolean): void {
        const keytext: string = keyCode.toUpperCase();
        this.getPhysKey(keytext).toggle(pressed);
    }

    private getPhysKey(keytext: string): Key {
        keytext = keytext.toUpperCase();
        if (this.keyboard.has(keytext)) {
            return this.keyboard.get(keytext);
        } else {
            return new Key();
        }
    }

    private keyPressed(e: KeyboardEvent): void {
        e.preventDefault();
        this.toggle(e.code.spinalCase(), true);
    }

    private keyReleased(e: KeyboardEvent): void {
        e.preventDefault();
        this.toggle(e.code.spinalCase(), false);
    }

    private keyTyped(e: Event): void {
        e.preventDefault();
    }

    constructor() {
        this.initKeyMap();
        document.addEventListener("keyup", (e) => this.keyReleased(e));
        document.addEventListener("keydown", (e) => this.keyPressed(e));

        this.keyboard.set("SHIFT-LEFT", new Key(true));
        this.keyboard.set("CONTROL-LEFT", new Key(true));
        this.keyboard.set("ALT-LEFT", new Key(true));
    }

    public resetKeyBindings(): void {
        this.keymap.clear();
        this.initKeyMap();
    }

    public releaseAll(): void {
        for (const key of this.keyboard.values()) {
            key.release();
        }
    }

    public tick() {
        if (!Game.HASFOCUS) {
            this.releaseAll();
        }
        for (const key of this.keyboard.values()) {
            key.tick();
        }
    }

    public getAllPressedKeys(): Key[] {
        const keys = [];
        for (const key of this.keyboard.values()) {
            if (key.down) {
                keys.push(key);
            }
        }
        return keys;
    }

    public getKey(keytext: string, getFromMap: boolean = true): Key {
        if (keytext == null || keytext.length === 0) {
            return new Key();
        }
        let key: Key = new Key();
        keytext = keytext.toUpperCase();

        if (getFromMap) {
            if (this.keymap.has(keytext)) {
                keytext = this.keymap.get(keytext);
            }
        }

        const fullKeytext: string = keytext;

        if (keytext.includes("|")) {
            key = new Key();
            for (const keypos of keytext.split("|")) {
                const aKey: Key = this.getKey(keypos, false);
                key.down = key.down || aKey.down;
                key.clicked = key.clicked || aKey.clicked;
            }
            return key;
        }


        if (keytext.includes("&")) {
            keytext = keytext.substring(keytext.lastIndexOf("&") + 1);
        }

        if (this.keyboard.has(keytext)) {
            key = this.keyboard.get(keytext);
        } else {
            key = new Key();
            this.keyboard.set(keytext, key);
            console.log(`Added new key: ${keytext}`);
        }


        keytext = fullKeytext;

        if (keytext.equals("SHIFT-LEFT") || keytext.equals("CONTROL-LEFT") || keytext.equals("ALT-LEFT")) {
            return key;
        }

        let foundS: boolean = false, foundC: boolean = false, foundA: boolean = false;
        if (keytext.includes("&")) {
            for (const keyname of keytext.split("&")) {
                if (keyname.equals("SHIFT-LEFT")) {
                    foundS = true;
                }
                if (keyname.equals("CONTROL-LEFT")) {
                    foundC = true;
                }
                if (keyname.equals("ALT-LEFT")) {
                    foundA = true;
                }
            }
        }

        const modMatch: boolean =
            this.getKey("SHIFT-LEFT").down === foundS &&
            this.getKey("CONTROL-LEFT").down === foundC &&
            this.getKey("ALT-LEFT").down === foundA;

        if (keytext.includes("&")) {
            const mainKey: Key = key;
            key = new Key();
            key.down = modMatch && mainKey.down;
            key.clicked = modMatch && mainKey.clicked;
        } else if (!modMatch) {
            key = new Key();
        }
        return key;
    }
}

