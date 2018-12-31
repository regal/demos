# my-first-game
This folder contains a basic Regal game to serve as an introduction to the Regal Framework.

The game is a clone of the classic *Rock, Paper, Scissors*.

## Installation
Clone this repository:

```
git clone https://github.com/regal/demos.git
```

Install dependencies:

```
cd my-first-game
npm install
```

## Building the Game
```
npm run build
```

This uses `regal-bundler` to create `my-first-game.regal.js`.

## Playing the Game
```
npm run play
```

This starts the game in the node terminal. Enter `Ctrl+C` to quit the game.

### Sample Gameplay
```
Play rock, paper, or scissors:
paper

The opponent plays rock.
Your paper beats the opponent's rock!
Your wins: 1. The opponent's wins: 0
Play rock, paper, or scissors:
rock

The opponent plays scissors.
Your rock beats the opponent's scissors!
Your wins: 2. The opponent's wins: 0
Play rock, paper, or scissors:
scissors

The opponent plays rock.
The opponent's rock beats your scissors...
Your wins: 2. The opponent's wins: 1
Play rock, paper, or scissors:
scissors

The opponent plays scissors.
It's a tie!
Your wins: 2. The opponent's wins: 1
Play rock, paper, or scissors:
```