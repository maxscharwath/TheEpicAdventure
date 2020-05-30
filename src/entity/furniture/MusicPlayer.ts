import Furniture from "./Furniture";
import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Howl} from "howler";
import NoteParticle from "../particle/NoteParticle";
import Updater from "../../core/Updater";

export default class MusicPlayer extends Furniture {
    private static baseTexture = PIXI.BaseTexture.from(System.getResource("furniture", "musicPlayer.png"));
    private disk: PIXI.Sprite;
    private playing = false;

    constructor() {
        super();
        this.hitbox.set(0, 3, 16, 10);
    }

    public onRender() {
        super.onRender();
        if (this.playing) {
            this.disk.rotation += 0.02;
        }
    }

    public onTick() {
        super.onTick();
        if (this.playing) {
            if (Updater.every(10)) {
                this.level.add(new NoteParticle(this.x, this.y + 2));
            }
        }
    }

    protected init() {
        const sprite = new PIXI.Sprite(new PIXI.Texture(MusicPlayer.baseTexture));
        this.disk = PIXI.Sprite.from(System.getResource("furniture", "disk.png"));
        sprite.anchor.set(0.5);
        this.disk.anchor.set(0.5);
        this.disk.position.set(-2, -1);
        this.container.addChild(sprite, this.disk);
        const sound = new Howl({
            src: [System.getResource("music", "disk7.mp3")],
            autoplay: false,
            loop: false,
            volume: 0.5,
            rate: 1,
            onend: () => {
                this.playing = false;
            },
            onplay: () => {
                this.playing = true;
            },
            onpause: () => {
                this.playing = true;
            },
        });
    }
}
