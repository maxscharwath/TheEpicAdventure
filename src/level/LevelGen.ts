import System from "../core/System";
import ChunkRandom from "../utility/ChunkRandom";
import Seed from "../utility/Seed";
import SimplexNoise from "../utility/SimplexNoise";
import Biome from "./biome/Biome";
import Level from "./Level";
import LevelTile from "./LevelTile";
import Tiles from "./tile/Tiles";

export default class LevelGen {

    private static chunkSize = 16;
    private elevationNoise: SimplexNoise;
    private moistureNoise: SimplexNoise;
    private temperatureNoise: SimplexNoise;

    public static create(seed?: number | string) {
        return new LevelGen(seed);
    }

    public seed = 0;

    constructor(seed: number | string) {
        this.seed = Seed.create(seed);
        this.elevationNoise = new SimplexNoise(this.seed);
        this.moistureNoise = new SimplexNoise((this.seed + 1) * 16);
        this.temperatureNoise = new SimplexNoise((this.seed + 2) * 32);
    }

    public genChunk(level: Level, cX: number, cY: number, callback?: () => void): LevelTile[] {
        const random = new ChunkRandom(this.seed, cX, cY);
        const t1 = System.nanoTime();
        const map = [];
        const x1 = cX * LevelGen.chunkSize;
        const y1 = cY * LevelGen.chunkSize;
        const x2 = x1 + LevelGen.chunkSize;
        const y2 = y1 + LevelGen.chunkSize;
        const zoom = 2;
        for (let y = y1; y < y2; y++) {
            for (let x = x1; x < x2; x++) {

                const elevation = ~~(this.elevationNoise.get(x, y,
                    {frequency: 32, zoom, octaves: 2, amplitude: 3, persistence: 0.5, evolution: 4}) * 255);

                const moisture = ~~(this.moistureNoise.get(x, y,
                    {zoom, frequency: 50, octaves: 3, amplitude: 2, persistence: 0.5, evolution: 2}) * 255);

                const temperature = ~~(this.temperatureNoise.get(x, y,
                    {zoom, frequency: 75, octaves: 3, amplitude: 2, persistence: 0.5, evolution: 2}) * 255);

                const river = ~~(( 2 * (0.5 - Math.abs(0.5 - this.elevationNoise.get(x, y,
                    {zoom: 2, frequency: 150, octaves: 4, evolution: 2.5, persistence: 1, amplitude: 1})))) * 255);

                let biome = Biome.from(elevation, moisture, temperature);
                if (!biome.tag.includes("ocean") && river > 240) { biome = Biome.get("river"); }

                const tile = new LevelTile({level, x, y, biome, moisture, temperature, elevation});
                map.push(tile);

                tile.setTile(Tiles.get("grass"));

                if (biome.tag.includes("ocean")) {
                    tile.setTile(Tiles.get("water"));
                    if (random.probability(50)) {
                        tile.setTile(Tiles.get("lilypad"));
                    }
                    if (temperature < 40 && random.probability(temperature / 25)) {
                        tile.setTile(Tiles.get("ice"));
                    }
                }
                if (biome.is("beach")) {
                    tile.setTile(Tiles.get("sand"));
                    if (random.probability(25)) {
                        tile.setTile(Tiles.get("palm"));
                    }
                }
                if (biome.is("desert")) {
                    tile.setTile(Tiles.get("sand"));
                    if (random.probability(50)) {
                        tile.setTile(Tiles.get("cactus"));
                    }
                }
                if (biome.is("savanna")) {
                    tile.setTile(Tiles.get("dirt"));
                }
                if (biome.is("forest")) {
                    tile.setTile(Tiles.get("grass"));
                    if (random.probability(2)) {
                        tile.setTile(Tiles.get("tree"));
                    } else if (random.probability(2)) {
                        tile.setTile(Tiles.get("spruce"));
                    }
                }
                if (biome.is("grassland")) {
                    if (random.probability(5)) {
                        tile.setTile(Tiles.get("tree"));
                    }
                }

                if (biome.is("tundra") || biome.is("snow")) {
                    tile.setTile(Tiles.get("snow"));
                    if (random.probability(5)) {
                        tile.setTile(Tiles.get("spruce"));
                    }
                }

                if (elevation > 210) {
                    tile.setTile(Tiles.get("rock"));
                }
                if (biome.is("river")) {
                    tile.setTile(Tiles.get("dirt"));
                    if (river > 245) {
                        tile.setTile(Tiles.get("water"));
                    }
                }
            }
        }
        console.log(`chunk ${cX} ${cY} generated in ${(System.nanoTime() - t1) / 1000000}ms`);
        if (callback instanceof Function) {
            callback();
        }
        return map;
    }
}
