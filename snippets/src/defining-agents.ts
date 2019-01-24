/**
 * Demonstrates how to define and use an agent.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Agent, on } from "regal";

class Bucket extends Agent {
    constructor(
        public size: number,
        public contents: string,
        public isFull: boolean
    ) {
        super();
    }
}

const init = on("INIT", game => {
    game.state.bucket = new Bucket(5, "famous chili", true);
});

const pour = on("POUR", game => {
    const bucket: Bucket = game.state.bucket;

    if (bucket.isFull) {
        bucket.isFull = false;
        game.output.write(`You pour out the ${bucket.contents}.`);
    } else {
        game.output.write("The bucket is already empty!");
    }
});

export default init.then(pour, pour);