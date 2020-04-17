import Game from "../core/Game";
import Settings from "../core/Settings";

export default class Server {
    private port: number;
    private io: any;
    private readonly server: any;
    private name: string = "MY SUPER SERVER";

    constructor() {
        const ip = require("ip");
        Game.ISONLINE = true;
        Game.ISHOST = true;
        this.port = Settings.get("port");

        const app = require("express")();
        this.server = new (require("http")).Server(app);
        this.server.once("error", (err: { code: string; }) => {
            if (err.code === "EADDRINUSE") {
                console.log("Port " + this.port + " is already used");
                this.port = Math.floor(Math.random() * 8999 + 1000);
                Settings.getEntry("port").setValue(this.port);
                this.server.listen(this.port);
            }
        });
        this.server.once("listening", () => {
            console.log(`Server started on ${ip.address()}:${this.port}`);
        });

        this.server.listen(this.port);
        this.io = require("socket.io")(this.server, {});

        app.get("/status", (req: any, res: any) => {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({
                name: this.name,
                version: Game.VERSION.toString(),
                online: Game.ISONLINE,
                port: Settings.get("port"),
            }, null, 3));
        });
    }

    public endConnection(): void {
        console.log("Server closing in 3s");
        setTimeout(() => {
            this.server.close(() => {
                console.log("Server closed!");
            });
        }, 3000);
    }

    public hasClients(): boolean {
        return this.io.sockets.clients() > 0;
    }
}
