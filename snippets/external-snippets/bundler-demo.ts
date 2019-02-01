/**
 * Demonstrates how game bundles are generated with regal-bundler and then played by clients.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { bundle } from "regal-bundler";
import { GameApi, GameResponse } from "regal";

// Helper function to print the output from a game response
const lines = (response: GameResponse) => 
    response.output.wasSuccessful 
    ? (response.output.log || []).map(line => line.data).join("\n") 
    : response.output.error.message;

(async () => {
    // Generate a game bundle
    await bundle({
        bundler: {
            input: { file: "my-game-src.ts" }, // Specify the game's root file
        }
    });

    // @ts-ignore
    const myGame: GameApi = await import("./my-game.regal.js"); // Import the game bundle

    // Send commands to the bundle
    let resp = myGame.postStartCommand();
    console.log(lines(resp));

    resp = myGame.postPlayerCommand(resp.instance, "The game bundle works! :D");
    console.log("\n" + lines(resp));
})();
