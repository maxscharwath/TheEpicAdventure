import Localization from "../../core/io/Localization";
import Color from "../../utility/Color";

export default class Biome {

    public static add(tag: string, biome: Biome): void {
        tag = tag.toLowerCase();
        console.log(`adding ${biome.name} to biome list with tag "${tag}"`);
        Biome.biomes[tag] = biome;
        biome.tag = tag;
    }

    public static get(tag: string): Biome {
        tag = tag.toLowerCase();
        if (!Biome.biomes[tag]) {
            throw new Error(`this tag '${tag}' doesn't exist!`);
        }
        return Biome.biomes[tag];
    }

    public static initBiomeList() {
        Biome.add("ocean", new Biome("Ocean", Color.fromHex("#026fff")));
        Biome.add("deep_ocean", new Biome("Deep Ocean", Color.fromHex("#0259bd")));
        Biome.add("warm_ocean", new Biome("Warm Ocean", Color.fromHex("#20abff")));
        Biome.add("cold_ocean", new Biome("Cold Ocean", Color.fromHex("#4cbcff")));
        Biome.add("beach", new Biome("Beach", Color.fromHex("#e0ff18")));
        Biome.add("tundra", new Biome("Tundra", Color.fromHex("#82fff5")));
        Biome.add("snow", new Biome("Snow", Color.fromHex("#f9f9f9")));
        Biome.add("taiga", new Biome("Taiga", Color.fromHex("#4b966f")));
        Biome.add("grassland", new Biome("Grassland", Color.fromHex("#35bf35")));
        Biome.add("forest", new Biome("Forest", Color.fromHex("#3fb132")));
        Biome.add("desert", new Biome("Desert", Color.fromHex("#ffd870")));
        Biome.add("jungle", new Biome("Jungle", Color.fromHex("#1a561a")));
        Biome.add("savanna", new Biome("Savanna", Color.fromHex("#9ce749")));
    }

    private static biomes: { [key: string]: Biome } = {};
    public readonly name: string;
    public readonly color: Color;
    public tag: string;

    constructor(name: string, color: Color) {
        this.name = name;
        this.color = color;
    }

    public getDisplayName(): string {
        return Localization.get(`biome.${this.tag}`);
    }

    public is(tag: string): boolean {
        return this.tag === tag.toLowerCase();
    }
}


