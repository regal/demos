/**
 * Demonstrates how to use game options.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Game, GameResponse } from "regal";
import "./options-game-src";

// Initialize the game
Game.init({
    name: "Options Game",
    author: "Me",
    options: {
        debug: true,
        seed: "Hello!"
    }
});

// Helper function to print the output from a game response
const lines = (response: GameResponse) => 
    response.output.wasSuccessful 
    ? (response.output.log || []).map(line => line.data).join("\n") 
    : response.output.error.message;

// Start the game
let res = Game.postStartCommand();
console.log(lines(res));

// Start a new game, this time with debug disabled
res = Game.postStartCommand({ debug: false });
console.log("\n" + lines(res));

// Send a player command
res = Game.postPlayerCommand(res.instance, "woof");
console.log("\n" + lines(res));

// Disable showMinor
res = Game.postOptionCommand(res.instance, { showMinor: false });

// Send another player command
res = Game.postPlayerCommand(res.instance, "arf");
console.log("\n" + lines(res));