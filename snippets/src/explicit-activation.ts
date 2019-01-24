/**
 * Demonstrates how to activate an agent explicitly.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Agent, on } from "regal";

class CustomAgent extends Agent {
    constructor(public num: number) {
        super();
    }
}

const explicit1 = on("EXPLICIT 1", game => {
    const agent = game.using(new CustomAgent(1)); // #1 is activated
    game.output.write(`${agent.num} is active.`);
});

const explicit2 = on("EXPLICIT 2", game => {
    const agents = game.using([ new CustomAgent(1), new CustomAgent(2) ]); // #1 and #2 are activated
    game.output.write(`${agents[0].num} and ${agents[1].num} are active.`);
});

const explicit3 = on("EXPLICIT 3", game => {
    const { agent1, agent2 } = game.using({
        agent1: new CustomAgent(1),
        agent2: new CustomAgent(2)
    }); // #1 and #2 are activated
    
    game.output.write(`${agent1.num} and ${agent2.num} are active.`);
});

export default explicit1.then(explicit2, explicit3);