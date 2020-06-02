import System from "../../core/System";
import {Mob} from "../../entity";
import Item from "../../item/Item";
import Items from "../../item/Items";
import AutoTilingTile from "./AutoTilingTile";
import Tiles from "./Tiles";
import ToolItem from "../../item/ToolItem";
import ToolType from "../../item/ToolType";
import HurtParticle from "../../entity/particle/HurtParticle";

export default class RockTile extends AutoTilingTile {
    public static readonly TAG = "rock";
    protected static autoTileTextures = RockTile.loadMaskTextures(System.getResource("tile", "rock.png"));
    private damage = 0;

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
        if (item instanceof ToolItem) {
            switch (item.type) {
                case ToolType.pickaxe:
                    const hurt = item.getAttackDamageBonus();
                    this.damage += hurt;
                    this.levelTile.level.add(
                        new HurtParticle(this.levelTile.x + 8, this.levelTile.y + 8, -hurt, 0xc80000),
                    );
                    if (this.damage >= 15) {
                        this.levelTile.setTile(Tiles.DIRT);
                        this.addItemEntity(Items.STONE, 2);
                    }
                    return true;
            }
        }
    }

}
