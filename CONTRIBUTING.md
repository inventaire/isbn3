# Contributing

## Setup

Install dependencies:

```sh
npm install
```

## Common Commands

Run the test suite:

```sh
npm test
```

Run the linter:

```sh
npm run lint
```

Run the benchmark:

```sh
npm run benchmark
```

Rebuild the browser demo bundle:

```sh
npm run dev:update-dist
```

## Checking the Browser Demo

To check the demo in [index.html](./index.html):

1. Rebuild with `npm run dev:update-dist`.
2. Open `index.html` in a browser.
3. Try an ISBN such as `9781781682135` and confirm both result blocks update.

For demo-page debugging, use the browser developer tools and set breakpoints in the inline script in `index.html`.

If you need to debug the library internals rather than the page behavior, prefer the Node-based launch configurations in `.vscode/launch.json`.

## Debugging

Yes, this project can be debugged directly in VS Code. VS Code's built-in JavaScript debugger uses the same Node inspector protocol, so you do not need a separate debugger setup.

This repository includes two example launch configurations in `.vscode/launch.json`:

1. `Debug parse test`: runs `test/parse.js` through Mocha.
2. `Debug CLI (isbn data)`: runs the `bin/isbn` CLI with a sample ISBN.

Open the Run and Debug view in VS Code and start either configuration.

If you prefer the terminal, the equivalent inspector commands are:

```sh
node --inspect-brk ./node_modules/mocha/bin/_mocha test/parse.js
node --inspect-brk ./bin/isbn 9781781682135 data
```

Once Node is waiting for the debugger, VS Code can attach to it with the built-in debugger.