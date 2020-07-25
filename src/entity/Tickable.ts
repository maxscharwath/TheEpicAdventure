import Level from "../level/Level";
import Chunk from "../level/Chunk";
import * as PIXI from "pixi.js";

export default interface Tickable extends PIXI.Container {
    ticks: number;
    x: number;
    y: number;
    z: number;

    remove(): void;

    onTick(): void;

    onRender(): void;

    getRemoved(): boolean;

    delete(level?: Level): void;

    setLevel(level: Level, x: number, y: number): void;

    getChunk(): Chunk | undefined;

    getLevel(): Level | undefined;

    add(): void;
};
