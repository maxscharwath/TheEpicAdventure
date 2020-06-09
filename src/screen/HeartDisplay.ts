import * as PIXI from "pixi.js";
import Display from "./Display";
import {Mob} from "../entity";
import SpriteSheet from "../gfx/SpriteSheet";
import System from "../core/System";

export default class HeartDisplay extends Display {
    private static textures = SpriteSheet.loadTextures(System.getResource("screen", "heart.png"), 3, 8);
    private mob: Mob;
    private hearts: PIXI.Sprite[] = [];
    private health: number;

    constructor(mob: Mob) {
        super();
        this.mob = mob;
        this.init();
    }

    public onRender() {
        super.onRender();
        // for (const heart of this.hearts) heart.pivot.y = Math.sin((System.milliTime()) / 80 + heart.x);
    }

    public onTick() {
        super.onTick();
        this.updateHeartBar();
    }

    private updateHeartBar() {
        if (this.health === this.mob.health) {
            return;
        }
        this.health = this.mob.health;
        let max = this.mob.maxHealth;
        if (max < this.mob.health) max = this.mob.health;
        const nbHeart = Math.ceil(max / 2);
        while (this.hearts.length !== nbHeart) {
            if (this.hearts.length > nbHeart) this.removeHeart();
            if (this.hearts.length < nbHeart) this.addHeart();
        }
        this.hearts.forEach((heart, i) => {
            const x = (i % 10) * 8;
            const y = ~~(i / 10) * 8;
            const num = Math.ceil(nbHeart * 2 / max * this.mob.health) / 2;
            if ((i + 1) === Math.ceil(nbHeart / max * this.mob.health) && !Number.isInteger(num)) {
                heart.texture = HeartDisplay.textures[1];
            } else if (i >= Math.ceil(nbHeart / max * this.mob.health)) {
                heart.texture = HeartDisplay.textures[2];
            } else {
                heart.texture = HeartDisplay.textures[0];
            }
            heart.position.set(x, y);
        });
    }

    private init() {
        this.scale.set(4);
    }

    private removeHeart() {
        const h = this.hearts.pop();
        h?.parent.removeChild(h);
    }

    private addHeart() {
        const h = new PIXI.Sprite(HeartDisplay.textures[0]);
        this.hearts.push(h);
        this.addChild(h);
    }
}
