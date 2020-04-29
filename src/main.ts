// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import Game from "./core/Game";
document.addEventListener("DOMContentLoaded", () => {
    Game.main();
});
// @ts-ignore
global.game = Game;
