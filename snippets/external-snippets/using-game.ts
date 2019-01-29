/**
 * Demonstrates the output of a basic start command and player command through the Game object.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Game } from "regal";
import "./my-game-src"; // Imports the game's root file, which has no exports

Game.init({
    name: "My Cool Game",
    author: "Me"
});

const pprint = json => JSON.stringify(json, null, 2);

const startResponse = Game.postStartCommand();
console.log("Start Response:", pprint(startResponse.output));

const playerResponse = Game.postPlayerCommand(startResponse.instance, "bark");
console.log("Player Response:", pprint(playerResponse.output));
