import udp from "dgram";
import Server from "./Server";

export default class ServerUDP {
    private server: udp.Socket;
    private PORT = 20000;

    constructor(server: Server) {
        this.server = udp.createSocket({type: "udp4", reuseAddr: true });
        this.server.on("message", (msg, info) => {
            const data = server.getPacketUDP();
            this.server.send(data, info.port, info.address, (error) => {
                if (error) console.error(error);
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
        this.server.bind(this.PORT);
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
