export default class RLE {
    public static encode<T>(iterable: T[], equality: (a: T, b: T) => boolean, mapped: (a: T) => number) {
        const data = [];
        for (let index = 0, howMany = 0; index < iterable.length; index++) {
            const aV = iterable[index + 1];
            const cV = iterable[index];
            howMany++;
            if (!(equality(cV, aV))) {
                data.push(((howMany) << 8) + (0b11111111 & mapped(cV)));
                howMany = 0;
            }
        }
        return Buffer.from(Uint16Array.from(data).buffer);
    }

    public static decode(b: Buffer, each?: (id: number, index: number) => void) {
        const data = [];
        for (let j = 0; j < b.length; j += 2) {
            const nb = b[j + 1];
            const id = b[j];
            for (let i = 0; i < nb; i++) {
                if (each) {
                    each(id, data.length);
                }
                data.push(id);
            }
        }
        return data;
    }
}