import fs from "fs";
import * as PIXI from "pixi.js";
import System from "../core/System";
import Direction from "../entity/Direction";

interface SpriteSheetData {
    animations: Array<{
        frames: Array<Array<number>>
        height: number;
        name: string;
        type: { [key: string]: number; };
        width: number;
    }>;
    url: string;
}

export default class SpriteSheet {

    public static loadTextures(path: string, nb: number, w: number = 16, h: number = w, oy = 0): Array<PIXI.Texture> {
        const bt = PIXI.BaseTexture.from(path);
        const textures = [];
        for (let x = 0; x < nb; x++) {
            textures.push(new PIXI.Texture(bt, new PIXI.Rectangle(x * w, oy, w, h)));
        }
        return textures;
    }

    constructor(url: string) {
        const data: SpriteSheetData = JSON.parse(fs.readFileSync(System.getResource("entity", url), "utf8"));
        const baseTexture = PIXI.BaseTexture.from(System.getResource(data.url));
        data.animations.forEach((animation) => {
            for (const type in animation.type) {
                if (!animation.type.hasOwnProperty(type)) continue;
                const y = animation.type[type];
                this.animations.set(`${animation.name}-${type}`, animation.frames.map((a: Array<number>) => {
                    return a.map((v: number) => {
                        return new PIXI.Texture(
                            baseTexture,
                            new PIXI.Rectangle(v * animation.width, y, animation.width, animation.height),
                        );
                    });
                }));
            }
        });
    }

    private animations: Map<string, Array<Array<PIXI.Texture>>> = new Map<string, Array<Array<PIXI.Texture>>>();

    public getAnimation(name: string, dir?: Direction, type: string = "normal"): Array<PIXI.Texture> {
        const id = `${name}-${type}`;
        const animation = this.animations.get(id);
        if (!animation) {
            throw new Error(`no animation "${id}" found`);
        }
        return animation[dir ? dir.valueOf() : 0];
    }
}
