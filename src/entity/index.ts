import Chicken from "./mob/Chicken";
import Player from "./mob/Player";
import Zombie from "./mob/Zombie";
import Fish from "./mob/Fish";
import AquaticMob from "./mob/AquaticMob";
import HostileMob from "./mob/HostileMob";
import Mob from "./mob/Mob";
import ItemEntity from "./ItemEntity";
import Entity from "./Entity";
import Entities from "./Entities";
import Chest from "./furniture/Chest";
import Furniture from "./furniture/Furniture";
import Bed from "./furniture/Bed";
import Skeleton from "./mob/Skeleton";
import Hook from "./Hook";
import Camp from "./furniture/Camp";

Entities.add(0, "player", Player);
Entities.add(1, "zombie", Zombie);
Entities.add(2, "skeleton", Skeleton);
Entities.add(3, "fish", Fish);
Entities.add(4, "itemEntity", ItemEntity);
Entities.add(5, "chicken", Chicken);
Entities.add(6, "chest", Chest);
Entities.add(7, "bed", Bed);
Entities.add(8, "camp", Camp);
Entities.add(9, "hook", Hook);

export {
    Entity,
    ItemEntity,
    Mob,
    AquaticMob,
    Fish,
    HostileMob,
    Player,
    Zombie,
    Skeleton,
    Chicken,
    Furniture,
    Chest,
    Bed,
    Hook,
    Camp,
};
