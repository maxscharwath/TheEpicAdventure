import fs from "fs";
import YAML from "yaml";

export default class Language {

    private static loadFile(path: string): string {
        return fs.readFileSync("src/resources/lang/" + path, "utf8");
    }
    private readonly path: string;
    private data = new Map<string, any>();
    public static all: Language[] = (() => {
        return fs.readdirSync("src/resources/lang").map((file) => new Language(file));
    })();
    public static loaded?: Language = Language.all[0];

    public static find(name: string): Language {
        return Language.all.find((lang) => lang.path === name);
    }
    public isLoaded: boolean = false;

    constructor(path: string) {
        this.path = path;
    }

    public load(): Language {
        if (Language.loaded instanceof Language) {
            Language.loaded.unLoad();
        }
        if (this.isLoaded) {
            return this;
        }
        this.isLoaded = true;
        Language.loaded = this;
        this.data = new Map(Object.entries(YAML.parse(Language.loadFile(this.path))));
        return this;
    }

    public unLoad(): Language {
        this.data.clear();
        this.isLoaded = false;
        if (Language.loaded === this) {
            Language.loaded = undefined;
        }
        return this;
    }

    public get(id: string): string {
        if (this.data.has(id)) {
            return this.data.get(id);
        }
        return id;
    }
}
