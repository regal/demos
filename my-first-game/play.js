// Import required modules
const game = require("./my-first-game.regal");
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Helper function to print output lines
const printLines = gameResponse => {
    console.log("");
    for (const line of gameResponse.output.log) {
        console.log(line.data);
    }
};

// Global to store the current game instance
let GAME_INSTANCE;

// Start game
const start = game.postStartCommand();
printLines(start);
GAME_INSTANCE = start.instance;

// Send each command to the game
readline.on("line", command => {
    const resp = game.postPlayerCommand(GAME_INSTANCE, command);
    printLines(resp);
    GAME_INSTANCE = resp.instance;
});