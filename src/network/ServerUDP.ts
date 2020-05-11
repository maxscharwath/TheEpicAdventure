import udp from "dgram";
import Server from "./Server";

export default class ServerUDP {
    private server: udp.Socket;

    constructor(server: Server) {
        this.server = udp.createSocket("udp4");
        this.server.on("message", (msg, info) => {
            this.server.send(server.getPacketUDP(), info.port, "localhost", (error) => {
                if (!error) {
                    console.log("Data sent !!!");
                }
            });
        });
        this.server.on("listening", () => {
            console.log("Server UDP is listening at port" + this.server.address().port);
        });

        this.server.on("close", () => {
            console.log("Socket is closed !");
        });
    }

    public startConnection() {
        this.server.bind(2222);
    }

    public endConnection(): void {
        console.log("Server closing in 3s");
        setTimeout(() => {
            this.server.close(() => {
                console.log("Server closed!");
            });
        }, 3000);
    }
}
