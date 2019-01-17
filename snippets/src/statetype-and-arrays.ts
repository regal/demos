import { on as _on, GameEventBuilder } from "regal";

interface MyState {
    num: number;
    names: string[];
}

const on: GameEventBuilder<MyState> = _on;

const init = on("INIT", game => {
    game.state.num = 0;
    game.state.names = ["spot", "buddy", "lucky"];
});

const pick = on("PICK", game => {
    const choice = game.state.names[game.state.num];
    game.output.write(`You picked ${choice}!`);
    game.state.num++;
});

export default init.then(pick, pick, pick);

