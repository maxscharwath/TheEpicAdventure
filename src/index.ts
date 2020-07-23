import * as path from "path";
import {app, BrowserWindow, remote} from "electron";
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
    mainWindow.loadFile(path.join(__dirname, "../resources/index.html")).then(()=>{

    });
    mainWindow.webContents.openDevTools();
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
