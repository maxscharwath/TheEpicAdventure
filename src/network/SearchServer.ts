import udp from "dgram";
import IP from "./IP";

interface ServerPacket {
    uid: string;
    ip: string;
    port: number;
}

export default class SearchServer {

    private static results: ServerPacket[] = [];
    private static timer?: NodeJS.Timeout;
    private static searching: boolean = false;
    private static PORT = 20000;

    public static start(callback?: (server: ServerPacket) => void) {
        if (this.searching) return this;
        this.results = [];
        this.searching = true;
        const client = udp.createSocket({type: "udp4", reuseAddr: true});
        const data = new Buffer(0);
        this.timer = setInterval(() => {
            client.send(data, 0, data.length, this.PORT, IP.broadcast(), (error) => {
                if (error) console.error(error);
            });
        }, 5000);
        client.on("message", (msg, info) => {
            const packet = JSON.parse(msg.toString());
            if (this.results.find((result) => result.uid === packet.uid)) {
                return;
            }
            this.results.push(packet);
            if (callback instanceof Function) {
                callback(packet);
            }
        });
        return this;
    }

    public static stop() {
        this.searching = false;
        if (this.timer) clearInterval(this.timer);
    }

    public static getResults() {
        return this.results;
    }
}

