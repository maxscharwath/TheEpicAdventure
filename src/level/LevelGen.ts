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
        this.moistureNoise = new SimplexNoise(this.seed * 32);
        this.temperatureNoise = new SimplexNoise(this.seed * 16);
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
                const elevation = ~~(Math.pow(
                    this.elevationNoise.noise2D(x / 32 / zoom, y / 32 / zoom) +
                    this.elevationNoise.noise2D(x / 8 / zoom, y / 8 / zoom) * 0.2 -
                    Math.pow(this.elevationNoise.noise2D(x / 6 / zoom, y / 6 / zoom) * 0.9, 6), 3,
                ) * 255);
                const moisture = ~~((this.moistureNoise.noise2D(x / 50 / zoom, y / 50 / zoom) +
                    this.moistureNoise.noise2D(x / 10 / zoom, y / 10 / zoom) * 0.2) * 255);

                const temperature = ~~((this.temperatureNoise.noise2D(x / 100 / zoom, y / 100 / zoom) +
                    this.temperatureNoise.noise2D(x / 10 / zoom, y / 10 / zoom) * 0.2) * 255);
                const biome = Biome.from(elevation, moisture, temperature);
                const tile = new LevelTile({level, x, y, biome, moisture, temperature, elevation});
                map.push(tile);

                if (elevation > 204) {
                    tile.setTile(Tiles.get("rock"));
                } else {
                    tile.setTile(Tiles.get("grass"));
                }

                if (biome.tag.includes("ocean")) {
                    tile.setTile(Tiles.get("water"));
                    if (random.probability(50)) {
                        tile.setTile(Tiles.get("lilypad"));
                    }
                }
                if (biome.tag.includes("beach")) {
                    tile.setTile(Tiles.get("sand"));
                    if (random.probability(25)) {
                        tile.setTile(Tiles.get("palm"));
                    }
                }
                if (biome.tag.includes("desert")) {
                    tile.setTile(Tiles.get("sand"));
                    if (random.probability(5)) {
                        tile.setTile(Tiles.get("cactus"));
                    }
                }
                if (biome.tag.includes("savanna")) {
                    tile.setTile(Tiles.get("dirt"));
                }
                if (biome.tag.includes("forest")) {
                    tile.setTile(Tiles.get("grass"));
                    if (random.probability(2)) {
                        tile.setTile(Tiles.get("tree"));
                    } else if (random.probability(2)) {
                        tile.setTile(Tiles.get("spruce"));
                    }
                }
                if (biome.tag.includes("grassland")) {
                    if (random.probability(5)) {
                        tile.setTile(Tiles.get("tree"));
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
