import udp from "dgram";

export default class SearchServer {
    public static search() {
        const client = udp.createSocket("udp4");
        const data = Buffer.from("HELLO");
        let nbTry = 0;
        return new Promise((resolve, reject) => {
            client.on("message", (msg, info) => {
                resolve(JSON.parse(msg.toString()));
            });
            const timer = setInterval(() => {
                if (nbTry++ > 10) {
                    clearInterval(timer);
                    reject("Timeout");
                }
                client.send(data, 2222, "localhost", (error) => {
                    if (error) {
                        reject(error);
                        client.close();
                    } else {
                        console.log("Data sent !!!");
                    }
                });
            }, 1000);
        });
    }
}

