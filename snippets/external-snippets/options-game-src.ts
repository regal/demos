import { onStartCommand, onPlayerCommand } from "regal";

onStartCommand(game => {
    game.output.write("Startup successful.");
    game.output.writeDebug(`Current seed -> ${game.options.seed}`);
})

onPlayerCommand(command => game => {
    game.output.writeMinor(`Your command was ${command}.`);
    game.output.write("Doing important stuff!");
});