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

    private biome(e: number, m: number, t: number) {
        if (e < 0.025) {
            return Biome.get("deep_ocean");
        }
        if (e < 0.1) {
            if (t > 0.9) {
                return Biome.get("warm_ocean");
            }
            if (t < 0.3) {
                return Biome.get("cold_ocean");
            }
            return Biome.get("ocean");
        }
        if (e < 0.18 && t > 0.4) {
            return Biome.get("beach");
        }
        if (t > 0.7) {
            if (m < 0.7) {
                return Biome.get("desert");
            }
            if (m > 0.8) {
                return Biome.get("jungle");
            }
        }
        if (t > 0.6) {
            if (m < 0.5) {
                return Biome.get("savanna");
            }
        }
        if (t < 0.20) {
            return Biome.get("snow");
        }
        if (t < 0.30) {
            return Biome.get("tundra");
        }
        if (t < 0.5) {
            if (m > 0.6) {
                return Biome.get("taiga");
            }
        }
        if (t < 6) {
            if (m > 0.4 && m < 0.6) {
                return Biome.get("forest");
            }
        }
        return Biome.get("grassland");
    }

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
                const e = Math.pow(
                    this.elevationNoise.noise2D(x / 32 / zoom, y / 32 / zoom) +
                    this.elevationNoise.noise2D(x / 8 / zoom, y / 8 / zoom) * 0.2 -
                    Math.pow(this.elevationNoise.noise2D(x / 6 / zoom, y / 6 / zoom) * 0.9, 6), 3,
                );
                const m = this.moistureNoise.noise2D(x / 50 / zoom, y / 50 / zoom) +
                    this.moistureNoise.noise2D(x / 10 / zoom, y / 10 / zoom) * 0.2;

                const t = this.temperatureNoise.noise2D(x / 100 / zoom, y / 100 / zoom) +
                    this.temperatureNoise.noise2D(x / 10 / zoom, y / 10 / zoom) * 0.2;
                const biome = this.biome(e, m, t);
                const tile = new LevelTile(level, x, y, biome);
                map.push(tile);

                if (e > 0.8) {
                    tile.setTile(Tiles.get("rock"));
                } else {
                    tile.setTile(Tiles.get("grass"));
                }

                if (biome.tag.includes("ocean")) {
                    tile.setTile(Tiles.get("water"));
                }
                if (biome.tag.includes("beach")) {
                    tile.setTile(Tiles.get("sand"));
                }
                if (biome.tag.includes("desert")) {
                    tile.setTile(Tiles.get("sand"));
                }
                if (biome.tag.includes("savanna")) {
                    tile.setTile(Tiles.get("dirt"));
                }
                if (biome.tag.includes("forest")) {
                    if (random.probability(0.7)) {
                        tile.setTile(Tiles.get("tree"));
                    } else if (random.probability(0.3)) {
                        tile.setTile(Tiles.get("palm"));
                    } else if (random.probability(0.3)) {
                        tile.setTile(Tiles.get("spruce"));
                    } else {
                        tile.setTile(Tiles.get("grass"));
                    }
                }
            }
        }
        console.log(`chunk generate in ${(System.nanoTime() - t1) / 1000000}ms`);
        if (callback instanceof Function) {
            callback();
        }
        return map;
    }
}
