import * as path from "path";
import {app, BrowserWindow} from "electron";

const isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;

if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("electron-reload")(__dirname);
}

let mainWindow: BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "main.js"),
        },
        show: true,
    });
    mainWindow.loadFile(path.join(__dirname, "../resources/index.html")).then(() => {

    });
    if (isDev) mainWindow.webContents.openDevTools();
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
