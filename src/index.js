const readline = require("readline");
const runAgent = require("./agent.js");

const colorRed = "\x1b[31m";
const colorYellow = "\x1b[33m";
const reset = "\x1b[0m";
const colorBlue = "\x1b[34m";

let currentModel = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";

const availableModels = [
  "gemini-flash-latest",
  "gemini-flash-lite-latest",
  "gemini-pro-latest",
  "gemini-3.5-flash",
  "gemini-3.1-pro-preview",
  "gemini-3-flash-preview",
  "gemini-3.1-flash-lite",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

function promptSelect(question, choices, defaultChoice) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    if (!stdin.isTTY) {
      resolve(defaultChoice);
      return;
    }

    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    readline.emitKeypressEvents(stdin);

    let selectedIndex = choices.indexOf(defaultChoice);
    if (selectedIndex === -1) selectedIndex = 0;

    // Hide cursor
    stdout.write("\u001B[?25l");

    function render() {
      stdout.write(`\r${colorBlue}Agent >${reset} ${question}\n`);
      for (let i = 0; i < choices.length; i++) {
        if (i === selectedIndex) {
          stdout.write(`  \x1b[36m➔  ${choices[i]}\x1b[0m\n`);
        } else {
          stdout.write(`     ${choices[i]}\n`);
        }
      }
    }

    function clear() {
      const linesToClear = choices.length + 1;
      for (let i = 0; i < linesToClear; i++) {
        stdout.write("\u001B[1A\u001B[2K");
      }
    }

    render();

    function onKeypress(char, key) {
      if (key) {
        if (key.name === "up") {
          clear();
          selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
          render();
        } else if (key.name === "down") {
          clear();
          selectedIndex = (selectedIndex + 1) % choices.length;
          render();
        } else if (key.name === "return" || key.name === "enter") {
          cleanup();
          resolve(choices[selectedIndex]);
        } else if (key.name === "escape" || (key.ctrl && key.name === "c")) {
          cleanup();
          resolve(null);
          if (key.ctrl && key.name === "c") {
            stdout.write("\u001B[?25h\n");
            process.exit(0);
          }
        }
      }
    }

    function cleanup() {
      clear();
      stdout.write("\u001B[?25h");
      stdin.removeListener("keypress", onKeypress);
      if (stdin.isTTY) {
        stdin.setRawMode(wasRaw);
      }
    }

    stdin.on("keypress", onKeypress);
  });
}

let rl;
let isTransitioning = false;

function createRL() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line) => {
      const parts = line.split(" ");
      if (parts[0] === "/model") {
        const hits = availableModels.filter((m) =>
          m.startsWith(parts[1] || ""),
        );
        return [hits.length ? hits : availableModels, parts[1] || ""];
      }
      const cmds = ["/help", "/model", "/exit"];
      const hits = cmds.filter((c) => c.startsWith(line));
      return [hits.length ? hits : cmds, line];
    },
  });

  rl.on("SIGINT", () => {
    console.log(`\n${colorBlue}Agent >${reset}`, "Goodbye! (ʘ‿ʘ)╯");
    rl.close();
    process.exit(0);
  });

  process.stdin.on("keypress", handleKeypress);
}

async function handleKeypress(str, key) {
  if (isTransitioning) return;

  setImmediate(async () => {
    if (isTransitioning) return;
    if (rl && rl.line && rl.line.trim() === "/model") {
      isTransitioning = true;

      // Clear the typed "/model" text from the current line
      process.stdout.write("\r\u001B[2K");

      process.stdin.removeListener("keypress", handleKeypress);
      rl.close();

      const selected = await promptSelect(
        "Select a model:",
        availableModels,
        currentModel,
      );
      if (selected) {
        currentModel = selected;
        console.log(
          `${colorBlue}Agent >${reset} Switched to: ${colorYellow}${currentModel}${reset}`,
        );
      } else {
        console.log(`${colorBlue}Agent >${reset} Selection cancelled.`);
      }

      isTransitioning = false;
      createRL();
      ask();
    }
  });
}

function ask() {
  rl.question(
    `${colorRed}You${reset} > `,
    async (input) => {
      const trimmed = input.trim();

      if (trimmed === "/exit") {
        console.log(`\n${colorBlue}Agent >${reset}`, "Goodbye! (ʘ‿ʘ)╯");
        process.exit(0);
      }

      if (trimmed === "/help") {
        console.log(`${colorBlue}Agent >${reset} Commands:`);
        console.log(`  /model [id]  - Show or switch model`);
        console.log(`  /exit        - Quit`);
        console.log(`  /help        - Show this message`);
        console.log(`  Current model: ${colorYellow}${currentModel}${reset}`);
        console.log(
          `  ${colorYellow}Tip:${reset} Type /model then Tab to see available models`,
        );
        return ask();
      }

      if (trimmed.startsWith("/model")) {
        const newModel = trimmed.slice(6).trim();
        if (!newModel) {
          // If they just hit enter on /model, trigger the dropdown menu
          process.stdin.removeListener("keypress", handleKeypress);
          rl.close();

          const selected = await promptSelect(
            "Select a model:",
            availableModels,
            currentModel,
          );
          if (selected) {
            currentModel = selected;
            console.log(
              `${colorBlue}Agent >${reset} Switched to: ${colorYellow}${currentModel}${reset}`,
            );
          } else {
            console.log(`${colorBlue}Agent >${reset} Selection cancelled.`);
          }

          createRL();
          return ask();
        }
        if (!availableModels.includes(newModel)) {
          console.log(
            `${colorRed}Error:${reset} Unknown model "${colorYellow}${newModel}${reset}"`,
          );
          console.log(`  Available: ${availableModels.join(", ")}`);
          return ask();
        }
        currentModel = newModel;
        console.log(
          `${colorBlue}Agent >${reset} Switched to: ${colorYellow}${currentModel}${reset}`,
        );
        return ask();
      }

      let didStream = false;
      const onToken = (token) => {
        if (!didStream) {
          process.stdout.write(`${colorBlue}Agent >${reset} `);
          didStream = true;
        }
        process.stdout.write(token);
      };

      const res = await runAgent(trimmed, { model: currentModel, onToken });

      if (didStream) {
        process.stdout.write("\n");
      } else {
        console.log(`${colorBlue}Agent >${reset}`, res);
      }

      ask();
    },
  );
}

createRL();
ask();
