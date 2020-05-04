import * as PIXI from "pixi.js";
import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import Random from "../../utility/Random";
import Tile from "./Tile";
import Tiles from "./Tiles";
import TileStates from "./TileStates";

export default class FarmlandTile extends Tile {
    protected states = TileStates.create({moisture: 0, age: 0});

    protected growthRate(initProb: number): boolean {
        const bonus = 1 + (this.states.moisture) / 10;
        if (bonus <= 0) {
            return false;
        }
        return Random.probability(initProb / bonus);
    }

    protected harvest() {

    }

    private filter: PIXI.filters.ColorMatrixFilter;
    public static readonly TAG: string = "farmland";

    public onInteract(mob: Mob, item?: Item) {
        if (!item || (item instanceof ToolItem && item.type === ToolType.hoe)) {
            console.log("harvest");
            this.harvest();
            this.levelTile.setTile(Tiles.FARMLAND);
            return true;
        }
        return false;
    }

    public init() {
        super.init();
        this.filter = new PIXI.filters.ColorMatrixFilter();
        const sprite = new PIXI.Sprite(PIXI.Texture.from(System.getResource("tile", "farmland.png")));
        sprite.filters = [this.filter];
        this.container.addChild(sprite);
    }

    public onTick(): void {
        super.onTick();
        if (Random.probability(50)) {
            if (!this.levelTile.findTileRadius(3, Tiles.WATER.tile)) {
                if (this.states.moisture > -10 && Random.probability(5)) {
                    --this.states.moisture;
                    this.filter.brightness(this.states.moisture / -40 + 1, false);
                }
            } else {
                if (this.states.moisture < 10) {
                    ++this.states.moisture;
                    this.filter.brightness(this.states.moisture / -40 + 1, false);
                }
            }
            if (this.states.moisture <= -10 && Random.probability(25)) {
                this.levelTile.setTile(Tiles.DIRT);
                this.harvest();
                return;
            }
        }
    }
}
