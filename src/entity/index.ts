import Player from "./mob/Player";
import Zombie from "./mob/Zombie";
import Fish from "./mob/Fish";
import AquaticMob from "./mob/AquaticMob";
import HostileMob from "./mob/HostileMob";
import Mob from "./mob/Mob";
import ItemEntity from "./ItemEntity";
import Entity from "./Entity";
import Entities from "./Entities";

Entities.add(0, "player", Player);
Entities.add(1, "zombie", Zombie);
Entities.add(2, "fish", Fish);
Entities.add(3, "itemEntity", ItemEntity);

export {
    Entity,
    ItemEntity,
    Mob,
    AquaticMob,
    Fish,
    HostileMob,
    Player,
    Zombie,
};
