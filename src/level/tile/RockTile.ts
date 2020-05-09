import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";

export default class RockTile extends AutoTilingTile {
    public static readonly TAG = "rock";
    protected static autoTileTextures = RockTile.loadMaskTextures(System.getResource("tile", "rock.png"));

    public init() {
        super.init();
        this.initAutoTile();
    }

    public onTick(): void {
        super.onTick();
    }

    public mayPass(): boolean {
        return false;
    }

    public onInteract(mob: Mob, item?: Item): boolean {
        this.levelTile.setTile(Tiles.DIRT);
        this.addItemEntity(Items.STONE, 2);
        return true;
    }

}
