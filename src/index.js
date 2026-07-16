const readline = require("readline");
const runAgent = require("./agent.js");

const colorRed = "\x1b[31m";
const reset = "\x1b[0m";
const colorBlue = "\x1b[34m";

const currentModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const conversation = [];

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
    let didStream = false;
    const onToken = (token) => {
      if (!didStream) {
        process.stdout.write(`${colorBlue}Agent >${reset} `);
        didStream = true;
      }
      process.stdout.write(token);
    };

    const res = await runAgent(input, conversation, { model: currentModel, onToken });

    if (didStream) {
      process.stdout.write("\n");
    } else {
      console.log(`${colorBlue}Agent >${reset}`, res);
    }

    ask();
  });
}

ask();
