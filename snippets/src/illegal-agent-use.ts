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
    waterBucket.isFull = false;
});

export default illegalEvent;