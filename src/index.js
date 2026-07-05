const readline = require("readline");
const runAgent = require("./agent.js");

const colorRed = "\x1b[31m";
const reset = "\x1b[0m";
const colorBlue = "\x1b[34m";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  rl.question(`${colorRed}You >${reset} `, async (input) => {
    const res = await runAgent(input);
    console.log(`${colorBlue}Agent >${reset}`, res);
    ask();
  });
}

ask();
