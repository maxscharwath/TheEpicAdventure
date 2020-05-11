import udp from "dgram";
import IP from "./IP";

export default class SearchServer {
    public static search() {
        const client = udp.createSocket({type: "udp4", reuseAddr: true });
        const data = Buffer.from("HELLO");
        let nbTry = 0;
        return new Promise((resolve, reject) => {
            const timer = setInterval(() => {
                if (nbTry++ > 10) {
                    clearInterval(timer);
                    reject("Timeout");
                }
                client.send(data, 0, data.length, this.PORT, IP.broadcast(), (error) => {
                    if (error) {
                        clearInterval(timer);
                        reject(error);
                        client.close();
                    } else {
                        console.log("Data sent !!!");
                    }
                });
            }, 1000);
            client.on("message", (msg, info) => {
                clearInterval(timer);
                resolve(JSON.parse(msg.toString()));
            });
        });
    }
    private static PORT = 20000;
}

