/**
 * Demonstrates each type of output line supported by InstanceOutput.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { on } from "regal";

const out = on("OUT", game => {
    game.output.writeNormal("This is normal output. Most of your game's output will be this type.");
    game.output.write("InstanceOutput.write is just a shorthand for writeNormal!");

    game.output.writeMajor("This is major output. Save this for really important stuff.");

    game.output.writeMinor("This is minor output. Use this for repetitive/flavor text that isn't necessary for the player to see.");

    game.output.writeDebug("This is debug output. It's only visible when the debug option is enabled.")

    game.output.writeTitle("This is a title.");
});

export default out;