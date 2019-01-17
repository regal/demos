import { onPlayerCommand, onStartCommand } from "regal";
import delayedExecution from "./delayed-exeuction";
import immediateExecution from "./immediate-execution";
import statetypeAndArrays from "./statetype-and-arrays";

const SNIPPETS = {
    immediate: immediateExecution,
    delay: delayedExecution,
    statetype: statetypeAndArrays
};

//~ Hooks ~//
onStartCommand(game => {
    game.output.write("Startup successful.");
    game.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`);
});

onPlayerCommand(command => game => {
    const cleanCmd = command.toLowerCase().trim();
    const snippet = SNIPPETS[cleanCmd];

    if (snippet === undefined) {
        game.output.write(`No snippet exists for command: ${command}.`);
        game.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`);
    } else {
        return snippet;
    }
});