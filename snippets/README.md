# snippets
This folder contains code snippets meant to demonstrate different aspects of Regal game programming.

## Installation
Clone this repository:

```
git clone https://github.com/regal/demos.git
```

Install dependencies:

```
cd snippets
npm install
```

## Building the Game
```
npm run build
```

This uses `regal-bundler` to create `regal-demo-snippets.regal.js`.

## Playing the Game
```
npm run play
```

This starts the game in the node terminal. Enter one of the [**snippet commands**](#snippets-1) to execute the snippet. Enter `Ctrl+C` to quit the game.

## Snippets

Name | Command | Description
--- | --- | ---
Immediate Exeuction | `immediate` | Demonstrates immediate event queueing.
Delayed Exeuction | `delay` | Demonstrates delayed event queueing.
StateType and Arrays | `statetype` | Demonstrates using `StateType` and `GameEventBuilder` to create parameterized events. Uses an agent array.
Illegal Agent Use | `illegal` | Throws an error because an inactive agent is accessed within a game cycle.

