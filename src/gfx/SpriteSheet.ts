import fs from "fs";
import {BaseTexture, Rectangle, Texture} from "pixi.js";
import System from "../core/System";
import Direction from "../entity/Direction";

interface SpriteSheetData {
    url: string;
    animations: Array<{
        name: string;
        width: number;
        height: number;
        type: { [key: string]: number; };
        frames: number[][]
    }>;
}

export default class SpriteSheet {
    private animations: Map<string, Texture[][]> = new Map<string, Texture[][]>();

    constructor(url: string) {
        const data: SpriteSheetData = JSON.parse(fs.readFileSync(System.getResource("entity", url), "utf8"));
        const baseTexture = BaseTexture.from(System.getResource(data.url));
        data.animations.forEach((animation) => {
            for (const type in animation.type) {
                if (!animation.type.hasOwnProperty(type)) continue;
                const y = animation.type[type];
                this.animations.set(`${animation.name}-${type}`, animation.frames.map((a: number[]) => {
                    return a.map((v: number) => {
                        return new Texture(
                            baseTexture,
                            new Rectangle(v * animation.width, y, animation.width, animation.height),
                        );
                    });
                }));
            }
        });
    }

    public getAnimation(name: string, dir?: Direction, type: string = "normal"): Texture[] {
        const id = `${name}-${type}`;
        const animation = this.animations.get(id);
        if (!animation) {
            throw new Error(`no animation "${id}" found`);
        }
        return animation[dir ? dir.valueOf() : 0];
    }
}
