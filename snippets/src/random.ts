/**
 * Demonstrates how to generate random values with InstanceRandom.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { on, Charsets, Agent } from "regal";

const randos = on("RANDOS", game => {
    const bool = game.random.boolean(); // Either true or false
    game.output.write(`Boolean -> ${bool}`);

    const int = game.random.int(1, 10); // Integer between 1 and 10, inclusive
    game.output.write(`Int -> ${int}`);

    const dec = game.random.decimal(); // Random decimal betweeen 0 and 1
    game.output.write(`Decimal -> ${dec}`); 

    const str = game.random.string(10); // Random string of length 10
    game.output.write(`String -> ${str}`);
});

const rstrings = on("RSTRINGS", game => {
    const alphanumeric = game.random.string(10, Charsets.ALHPANUMERIC_CHARSET);
    game.output.write(`Alphanumeric -> ${alphanumeric}`);

    const alphabet = game.random.string(10, Charsets.ALPHABET_CHARSET);
    game.output.write(`Alphabet -> ${alphabet}`);

    const numbers = game.random.string(10, Charsets.NUMBERS_CHARSET);
    game.output.write(`Numbers -> ${numbers}`);

    const hex = game.random.string(10, Charsets.NUMBERS_CHARSET + "ABCDEF");
    game.output.write(`Hex -> ${hex}`);

    const binary = game.random.string(10, "10");
    game.output.write(`Binary -> ${binary}`);

    game.output.write(`Old MacDonald had a farm, ${game.random.string(5, "eio")}.`);
});

class Item extends Agent {
    constructor(public name: string) {
        super();
    }
}

const init = on("INIT", game => {
    game.state.items = [
        new Item("Yo-Yo"),
        new Item("Pigeon"),
        new Item("Corn cob")
    ];
});

const rpick = on("RPICK", game => {
    const i: Item = game.random.choice(game.state.items);
    game.output.write(`You picked the ${i.name}!`);
});

export default randos.then(rstrings).then(init, rpick, rpick, rpick);