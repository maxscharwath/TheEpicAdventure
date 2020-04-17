import fs from "fs";
import {BaseTexture, Rectangle, Texture} from "pixi.js";
import Direction from "../entity/Direction";

export default class SpriteSheet {
    private animations: Map<string, Texture[][]> = new Map<string, Texture[][]>();

    constructor(url: string) {
        const data = JSON.parse(fs.readFileSync(`src/resources/entity/${url}`, "utf8"));
        const baseTexture = BaseTexture.from(data.url);
        for (const i in data.animations) {
            if (!data.animations.hasOwnProperty(i)) {
                continue;
            }
            const value = data.animations[i];
            this.animations.set(i, value.map((a: number[]) => {
                return a.map((v: number) => {
                    return new Texture(
                        baseTexture,
                        new Rectangle(v * data.width, 0, data.width, data.height),
                    );
                });
            }));
        }
    }

    public getAnimation(name: string, dir?: Direction): Texture[] {
        if (!this.animations.has(name)) {
            throw new Error(`no animation "${name}" found`);
        }
        return this.animations.get(name)[dir ? dir.valueOf() : 0];
    }
}
