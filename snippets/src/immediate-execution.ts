import { on, Agent } from "regal";

const learnSkill = (name: string, skill: string) =>
    on(`LEARN SKILL <${skill}>`, game => {
        game.state[name].skills.push(skill);
        game.output.write(`${name} learned ${skill}!`);
    });

const addItemToInventory = (name: string, item: string) =>
    on(`ADD ITEM <${item}>`, game => {
        game.state[name].inventory.push(item);
        game.output.write(`Added ${item} to ${name}'s inventory.`);
    });

const makeSword = (name: string) =>
    on(`MAKE SWORD`, game => {
        game.output.write(`${name} made a sword!`);
        return learnSkill(name, "Blacksmithing")
            .then(addItemToInventory(name, "Sword"));
    });

class Fighter extends Agent {
    constructor(
        public inventory: string[] = [], 
        public skills: string[] = []
    ) {
        super();
    }
}

const prepImmediate = (name: string) =>
    on("PREP IMMEDIATE", game => {
        game.state[name] = new Fighter();
    });

const NAME = "King Arthur";

export default prepImmediate(NAME).then(makeSword(NAME));