/**
 * Demonstrates all the ways that agents can be activated implicitly.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Agent, on } from "regal";

class Parent extends Agent {
    constructor(
        public num: number,
        public child?: Agent // Optional child property
    ) {
        super();
    }
}

class MultiParent extends Agent {
    constructor(
        public num: number,
        public children: Agent[] = [] // Default to an empty array
    ) {
        super();
    }
}

const implicit1 = on("IMPLICIT 1", game => {
    game.state.myAgent = new Parent(1); // #1 is activated by GameInstance.state
    game.state.myAgent.child = new Parent(2); // #2 is activated by #1

    game.output.write(`${game.state.myAgent.num} and ${game.state.myAgent.child.num} are active.`);
});

const implicit2 = on("IMPLICIT 2", game => {
    const p = new Parent(1, new Parent(2)); // #1 and #2 are both inactive
    game.state.myAgent = p; // #1 and #2 are activated by GameInstance.state

    game.output.write(`${game.state.myAgent.num} and ${game.state.myAgent.child.num} are active.`);
});

const implicit3 = on("IMPLICIT 3", game => {
    const mp = new MultiParent(1, [ new Parent(2), new Parent(3) ]); // #1, #2, and #3 are inactive
    game.state.myAgent = mp; // #1, #2, and #3 are activated by GameInstance.state

    game.output.write(`${game.state.myAgent.num}, ${
        game.state.myAgent.children[0].num
    }, and ${
        game.state.myAgent.children[1].num
    } are active.`);
});

const implicit4 = on("IMPLICIT 4", game => {
    game.state.myAgent = new MultiParent(1); // #1 is activated by GameInstance.state
    game.state.myAgent.children = [ new Parent(2), new Parent(3) ]; // #2 and #3 are activated by #1

    game.output.write(`${game.state.myAgent.num}, ${
        game.state.myAgent.children[0].num
    }, and ${
        game.state.myAgent.children[1].num
    } are active.`);
});

const implicit5 = on("IMPLICIT 5", game => {
    game.state.myAgent = new MultiParent(1, [ new Parent(2) ]); // #1 and #2 are activated by GameInstance.state
    game.state.myAgent.children.push(new Parent(3)); // #3 is activated by #1

    game.output.write(`${game.state.myAgent.num}, ${
        game.state.myAgent.children[0].num
    }, and ${
        game.state.myAgent.children[1].num
    } are active.`);
});

export default implicit1.then(implicit2, implicit3, implicit4, implicit5);