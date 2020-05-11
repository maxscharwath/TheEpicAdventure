import {OptionsJson} from "body-parser";
import express from "express";
import http from "http";
import ip from "ip";
import socketio from "socket.io";
import Game from "../core/Game";
import Settings from "../core/Settings";
import Random from "../utility/Random";
import ServerUDP from "./ServerUDP";

export default class Server {
    private port: number;
    private name: string = "MY SUPER SERVER";
    private readonly server: http.Server;
    private io: socketio.Server;
    private udp = new ServerUDP(this);

    constructor() {
        Game.isOnline = true;
        Game.isHost = true;
        this.port = Settings.get("port");

        const app = express();
        this.server = new http.Server(app);
        this.server.once("error", (err: { code: string; }) => {
            if (err.code === "EADDRINUSE") {
                console.log("Port " + this.port + " is already used");
                this.port = Random.int(8999, 9999);
                Settings.getEntry("port").setValue(this.port);
                this.server.listen(this.port);
            }
        });
        this.server.once("listening", () => {
            console.log(`Server started on ${ip.address()}:${this.port}`);
        });

        this.io = socketio(this.server, {});

        app.get("/status", (req: any, res: any) => {
            res.json({
                name: this.name,
                version: Game.version.toString(),
                online: Game.isOnline,
                ip: ip.address(),
                port: this.port,
            } as OptionsJson);
        });
    }

    public getPacketUDP() {
        return Buffer.from(JSON.stringify({
            name: this.name,
            version: Game.version.toString(),
            online: Game.isOnline,
            ip: ip.address(),
            port: this.port,
        }));
    }

    public startConnection() {
        this.udp.startConnection();
        this.server.listen(this.port);
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
        return this.io.sockets.clients.length > 0;
    }
}
