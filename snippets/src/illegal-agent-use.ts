/**
 * Throws an error because an inactive agent is accessed within a game cycle.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { on, Agent } from "regal";

class Bucket extends Agent {
    constructor(
        public size: number,
        public contents: string,
        public isFull: boolean
    ) {
        super();
    }
}

const illegalEvent = on("EVENT", game => {
    const waterBucket = new Bucket(1, "water", true);
    waterBucket.isFull = false; // Uh-oh!
});

export default illegalEvent;