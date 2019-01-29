import { onStartCommand, onPlayerCommand } from "regal";

onStartCommand(game => {
    game.output.write("Hello, world!");
});

onPlayerCommand(command => game => {
    game.output.write(`You wrote '${command}'!`);
});