type ExtendedProperties<T> = { [P in keyof T]: T[P] };
export default class TileStates<T> {
    private readonly defaultStates: T;

    private constructor(defaultStates: T) {
        this.defaultStates = defaultStates;
        this.resetDefault();
    }

    public static create<T>(def: T = {} as T): TileStates<T> & ExtendedProperties<T> {
        return new TileStates(def) as TileStates<T> & ExtendedProperties<T>;
    }

    public resetDefault() {
        Object.keys(this.defaultStates).forEach((key: any) => {
            this[key] = this.defaultStates[key];
        });
        return this;
    }

    public getStates(): T {
        const keys = Object.keys(this.defaultStates);
        const data = {};
        keys.forEach((key: any) => {
            data[key] = this[key];
        });
        return data as T;
    }

    public toBSON() {
        const keys = Object.keys(this.defaultStates);
        if (keys.length === 0) {
            return null;
        }
        const data = {};
        keys.forEach((key: any) => {
            if (this[key] !== this.defaultStates[key]) {
                data[key] = this[key];
            }
        });
        if (Object.keys(data).length === 0) {
            return null;
        }
        return data;
    }

    public set(data: object) {
        if (!(data instanceof Object)) {
            return this;
        }
        Object.keys(data).forEach((key: any) => {
            if (this.defaultStates.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        });
        return this;
    }
}
