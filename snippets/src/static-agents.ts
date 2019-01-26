/**
 * Demonstrates how to define and use static agents.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { Agent, on } from "regal";

// Declare a new agent class called Book
class Book extends Agent {
    constructor(
        public title: string,
        public author: string,
        public content: string
    ) {
        super();
    }
}

const reallyLongString = "To Mrs. Saville, England St. Petersburgh, Dec. 11th, 17- You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking..."

// Declare a static Book agent
const NOVEL = new Book(
    "Frankenstein",
    "Mary Shelley",
    reallyLongString
);

NOVEL.title += ", or The Modern Prometheus";

const read = on("READ", game => {
    const novel = game.using(NOVEL); // Activate the static agent
    game.output.write(`You open ${novel.title}, by ${novel.author}.`);

    const excerpt = novel.content.split(" ").slice(0, 4).join(" "); // Grab the first 4 words
    game.output.write(`It begins, "${excerpt}..."`);
});

const revise = (playerName: string, forward: string) =>
    on("REVISE", game => {
        const novel = game.using(NOVEL);
        novel.content = forward + " " + novel.content;
        novel.author += ` (with a forward by ${playerName})`
    });

export default read.then(revise("Lars", "Pancakes!")).then(read);