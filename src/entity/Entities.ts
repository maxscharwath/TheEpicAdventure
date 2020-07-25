import KeyedMap from "../utility/KeyedMap";
import {Entity} from "./index";

type Type<T> = new (...args: Array<any>) => T;
const Entities = new KeyedMap<Type<Entity>>();
export default Entities;
