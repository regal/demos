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
Defining Agents | `agent` | Demonstrates how to define and use an agent.
Illegal Agent Use | `illegal` | Throws an error because an inactive agent is accessed within a game cycle.
Implicit Activation | `implicit` | Demonstrates all the ways that agents can be activated implicitly.
Explicit Activation | `explicit` | Demonstrates how to activate an agent explicitly.
Static Agents | `static` | Demonstrates how to define and use static agents.
Random | `random` | Demonstrates how to generate random values with `InstanceRandom`.
Output | `output` | Demonstrates each of type of output line supported by `InstanceOutput`.

## External Snippets

Some code snippets in this project demonstrate how a client would use the Regal API externally. 

To run these snippets, first install `ts-node`:
```
npm install -g ts-node
```

Navigate to the `external-snippets` directory:
```
cd external-snippets
```

Then, run one of the following commands from the terminal:

Name | Command | Description
--- | --- | ---
Using `Game` | `ts-node using-game` | Demonstrates the output of a basic start command and player command through the `Game` object.
Undo | `ts-node undo` | Demonstrates undo commands and how to use the `onBeforeUndoCommand` hook.
Options | `ts-node options-demo` | Demonstrates how to use game options.
