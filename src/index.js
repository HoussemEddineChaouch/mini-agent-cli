const readline = require("readline");
const runAgent = require("./agent.js");
const { tools } = require("./tools.js");

const colorRed = "\x1b[31m";
const reset = "\x1b[0m";
const colorBlue = "\x1b[34m";

const conversation = [];

const args = process.argv.slice(2);
const wantsHelp = args.includes("--help") || args.includes("-h");

function printHelp() {
  const toolsSummary = Object.entries(tools)
    .map(([name, details]) => `  - ${name}: ${details.description}`)
    .join("\n");

  // TODO: adjust usage before publishing to npm.
  console.log(`
    Mini Agent CLI

    Usage:
      node src/index.js [options]

    Options:
      -h, --help   Show this help message and exit.

    Description:
      Interactive CLI AI agent with tool-calling support.

    Interactive usage:
      Type a prompt and press Enter.
      Press Ctrl+C to exit.

    Available tools:
    ${toolsSummary}
    `.trim());
}

if (wantsHelp) {
  printHelp();
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("SIGINT", () => {
  console.log(`\n${colorBlue}Agent >${reset}`, "Goodbye! (ʘ‿ʘ)╯");
  rl.close();
  process.exit(0);
});

function ask() {
  rl.question(`${colorRed}You >${reset} `, async (input) => {
    const res = await runAgent(input, conversation);
    console.log(`${colorBlue}Agent >${reset}`, res);
    ask();
  });
}

ask();
