/**
 * Demonstrates undo commands and how to use the onBeforeUndoCommand hook.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Game, GameResponse } from "regal";
import "./undo-game-src";

// Initialize the game
Game.init({
    name: "Undo Game",
    author: "Me"
});

// Helper function to print the output from a game response
const lines = (response: GameResponse) => 
    response.output.wasSuccessful 
    ? (response.output.log || []).map(line => line.data).join("\n") 
    : response.output.error.message;

// Start the game
let res = Game.postStartCommand();
console.log(lines(res));

// Send three player commands to the game
for (const item of ["cat", "dog", "mouse"]) {
    res = Game.postPlayerCommand(res.instance, item);
    console.log("\n" + lines(res));
}

// Undo the last player command -- this should be allowed
res = Game.postUndoCommand(res.instance);
console.log("\nUndoing last command.", lines(res));

// Send another player command
res = Game.postPlayerCommand(res.instance, "goose");
console.log("\n" + lines(res));

// Undo the last player command -- this one should be blocked
res = Game.postUndoCommand(res.instance);
console.log("\nUndoing last command.", lines(res));