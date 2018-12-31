import { onPlayerCommand, onStartCommand } from "regal";

//~ Constants ~//
const POSSIBLE_MOVES = ["rock", "paper", "scissors"];
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

//~ Hooks ~//
onStartCommand(game => {
    // Initialize state
    game.state.playerWins = 0;
    game.state.opponentWins = 0;

    // Prompt the player
    game.output.write("Play rock, paper, or scissors:");
});

onPlayerCommand(command => game => {
    // Sanitize the player's command
    const playerMove = command.toLowerCase().trim();

    // Make sure the command is valid
    if (POSSIBLE_MOVES.includes(playerMove)) {
        // Choose a move for the opponent
        const opponentMove = game.random.choice(POSSIBLE_MOVES);
        game.output.write(`The opponent plays ${opponentMove}.`);

        if (playerMove === opponentMove) {
            game.output.write("It's a tie!");
        } else {
            // Look up who wins in the win table
            const isPlayerWin = WIN_TABLE[playerMove][opponentMove];

            if (isPlayerWin) {
                game.output.write(`Your ${playerMove} beats the opponent's ${opponentMove}!`);
                game.state.playerWins++;
            } else {
                game.output.write(`The opponent's ${opponentMove} beats your ${playerMove}...`);
                game.state.opponentWins++;
            }
        }
        // Print win totals
        game.output.write(`Your wins: ${game.state.playerWins}. The opponent's wins: ${game.state.opponentWins}`);
    } else {
        // Print an error message if the command isn't rock, paper, or scissorss
        game.output.write(`I don't understand that command: ${playerMove}.`);
    }

    // Prompt the player again
    game.output.write("Play rock, paper, or scissors:");
});