const readline = require("readline");
const runAgent = require("./agent.js");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  rl.question("You > ", async (input) => {
    const res = await runAgent(input);
    console.log("Agent >", res);
    ask();
  });
}

ask();
