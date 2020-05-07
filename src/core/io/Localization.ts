import Language from "./Language";

export default class Localization {

    public static languages: Language[] = Language.all;

    public static loadLanguage(lang: Language | string) {
        if (!(lang instanceof Language)) {
            lang = Language.find(lang);
        }
        lang.load();
    }

    public static verify(id: string): boolean {
        return Language.loaded.has(id);
    }

    public static get(id: string): string {
        if (Language.loaded instanceof Language) {
            return Language.loaded.get(id);
        }
        return id;
    }

    public static getCurrent(): Language {
        return Language.loaded;
    }
}
