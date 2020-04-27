interface KeyData<T> {
    idx: number;
    tag: string;
    data: T;
}

export default class KeyedMap<T> {
    private data: Array<KeyData<T>> = [];

    public add(idx: number, tag: string, data: T) {
        if (this.getByIdx(idx) || this.getByTag(tag)) {
            return false;
        }
        this.data.push({idx, tag, data});
        return true;
    }

    public getSome(...tags: string[]): T[] {
        return this.data.flatMap((kd) => tags.includes(kd.tag) ? [kd.data] : []);
    }

    public getByIdx(idx: number): T {
        return this.data.find((kd) => kd.idx === idx)?.data;
    }

    public getByTag(tag: string): T {
        return this.data.find((kd) => kd.tag === tag)?.data;
    }

    public get(index: string | number): T {
        return isNaN(index as number) ? this.getByTag(index.toString()) : this.getByIdx(index as number);
    }

    public getKeys(data: T): { idx: number, tag: string } {
        const keyData = this.data.find((kd) => kd.data === data);
        return {
            idx: keyData?.idx,
            tag: keyData?.tag,
        };
    }
}
