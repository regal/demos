/**
 * Demonstrates immediate event queueing.
 * 
 * For more information, see https://github.com/regal/regal.
 */

import { on } from "regal";

const learnSkill = (name: string, skill: string) =>
    on(`LEARN SKILL <${skill}>`, game => {
        game.output.write(`${name} learned ${skill}!`);
    });

const addItemToInventory = (name: string, item: string) =>
    on(`ADD ITEM <${item}>`, game => {
        game.output.write(`Added ${item} to ${name}'s inventory.`);
    });

const makeSword = (name: string) =>
    on(`MAKE SWORD`, game => {
        game.output.write(`${name} made a sword!`);
        return learnSkill(name, "Blacksmithing")
            .then(addItemToInventory(name, "Sword"));
    });

export default makeSword("King Arthur");