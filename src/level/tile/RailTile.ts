import * as PIXI from "pixi.js";
import Tile from "./Tile";
import SpriteSheet from "../../gfx/SpriteSheet";
import System from "../../core/System";
import {Mob, Entity} from "../../entity";
import TileStates from "./TileStates";
import Tiles from "./Tiles";
type Type<T> = new (...args: any[]) => T;

export default class RailTile extends Tile {
    public static DEFAULT_STATES = {connected: false, direction: 0, groundTile: 0};
    public static readonly TAG = "rail";
    protected static textures = SpriteSheet.loadTextures(System.getResource("tile", "rail.png"), 6, 16);

    public states = TileStates.create(RailTile.DEFAULT_STATES);
    private sprite: PIXI.Sprite;

    public init() {
        super.init();
        this.sprite = new PIXI.Sprite();
        this.container.addChild(this.sprite);
        this.setGroundTile(Tiles.get(this.states.groundTile));
    }

    public onSetTile(oldTile: Tile, entity?: Entity) {
        this.setGroundTile(oldTile);
        if (entity instanceof Mob) {
            this.states.direction = Number(entity.getDir().isX());
        }
    }

    public setGroundTile(tile: typeof Tile | Tile): Tile {
        const t = super.setGroundTile(tile);
        this.states.groundTile =  t.getKeys().idx;
        return t;
    }

    public onUpdate() {
        super.onUpdate();
        const test = (x: number, y: number) => {
            const t = this.levelTile.getRelativeTile(x, y, false);
            return t && t.instanceOf(RailTile);
        };
        const u = test(0, -1);
        const d = test(0, 1);
        const l = test(-1, 0);
        const r = test(1, 0);
        if (d && l) this.states.direction = 3;
        if (d && r) this.states.direction = 2;
        if (u && l) this.states.direction = 5;
        if (u && r) this.states.direction = 4;
        if (u || d || l || r) this.states.connected = true;
        this.sprite.texture = RailTile.textures[this.states.direction];
    }

}
