/**
 * Demonstrates delayed event queueing.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { on, enqueue } from "regal";

const hitGround = (item: string) =>
    on(`HIT GROUND <${item}>`, game => {
        game.output.write(`${item} hits the ground. Thud!`);
    });

const fall = (item: string) =>
    on(`FALL <${item}>`, game => {
        game.output.write(`${item} falls.`);
        return enqueue(hitGround(item));
    });

const drop = on("DROP ITEMS", game => {
        let q = enqueue();
        for (let item of game.state.items) {
            q = q.enqueue(fall(item));
        }
        return q;
    });

const prepDelay = on("PREP DELAY", game => {
    game.state.items = ["Hat", "Duck", "Spoon"];
});

export default prepDelay.then(drop);