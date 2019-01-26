import { onPlayerCommand, onStartCommand, TrackedEvent, on } from "regal";

import delayedExecution from "./delayed-exeuction";
import immediateExecution from "./immediate-execution";
import statetypeAndArrays from "./statetype-and-arrays";
import definingAgents from "./defining-agents";
import illegalAgentUse from "./illegal-agent-use";
import implicitActivation from "./implicit-activation";
import explicitActivation from "./explicit-activation";
import staticAgents from "./static-agents";

const SNIPPETS = {
    immediate: immediateExecution,
    delay: delayedExecution,
    statetype: statetypeAndArrays,
    agent: definingAgents,
    illegal: illegalAgentUse,
    implicit: implicitActivation,
    explicit: explicitActivation,
    static: staticAgents
};

//~ Hooks ~//
onStartCommand(game => {
    game.output.write("Startup successful.");
    game.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`);
});

onPlayerCommand(command => game => {
    const cleanCmd = command.toLowerCase().trim();
    const snippet = SNIPPETS[cleanCmd] as TrackedEvent;

    if (snippet === undefined) {
        game.output.write(`No snippet exists for command: ${command}.`);
        game.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`);
    } else {
        return snippet.thenq(on("END", game => game.output.write("", "(End of snippet)")));
    }
});