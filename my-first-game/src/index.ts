import { onPlayerCommand, onStartCommand } from "regal";

// Constants
const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";
const POSSIBLE_MOVES = [ROCK, PAPER, SCISSORS];

const WIN_TABLE = {
    rock: {
        paper: false,
        scissors: true
    },
    paper: {
        rock: true,
        scissors: false
    },
    scissors: {
        rock: false,
        paper: true
    }
}

// Hooks
onPlayerCommand(command => game => {
    const playerMove = command.toLowerCase().trim();

    if (POSSIBLE_MOVES.includes(playerMove)) {
        const opponentMove = game.random.choice(POSSIBLE_MOVES);
        game.output.write(`The opponent plays ${opponentMove}.`);

        if (playerMove === opponentMove) {
            game.output.write("It's a tie!");
        } else {
            const isWin = WIN_TABLE[playerMove][opponentMove];
            if (isWin) {
                game.output.write(`Your ${playerMove} beats the opponent's ${opponentMove}!`);
                game.state.playerWins++;
            } else {
                game.output.write(`The opponent's ${opponentMove} beats your ${playerMove}...`);
                game.state.opponentWins++;
            }
        }
        game.output.write(`Your wins: ${game.state.playerWins}. The opponent's wins: ${game.state.opponentWins}`);
    } else {
        game.output.write(`I don't understand that command: ${playerMove}.`);
    }

    game.output.write("Play rock, paper, or scissors:");
});

onStartCommand(game => {
    game.state.playerWins = 0;
    game.state.opponentWins = 0;

    game.output.write("Play rock, paper, or scissors:");
});