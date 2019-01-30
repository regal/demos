import { onPlayerCommand, onStartCommand, on, onBeforeUndoCommand } from "regal";

// Print out the list of items in the state
const printItems = on("ITEMS", game => {
    const itemsString = game.state.items.join(", ");
    game.output.write(`Items (${game.state.items.length}) -> [${itemsString}]`);
});

onStartCommand(game => {
    game.state.items = []; // Initialize state.items with an empty array
    return printItems;
});

onPlayerCommand(command => game => {
    game.output.write(`Adding ${command}.`);
    game.state.items.push(command); // Add the new item to the state
    return printItems;
});

onBeforeUndoCommand(game =>
    !game.state.items.includes("goose") // Block undo if there's a goose in the array
);