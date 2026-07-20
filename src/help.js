const { tools } = require("./tools.js");

const colorRed = "\x1b[31m";
const reset = "\x1b[0m";
const colorBlue = "\x1b[34m";

function printHelp() {
  const section = (title) => `${colorBlue}${title}${reset}`;
  const toolLabel = (name) => `[${name}]`;

  const toolsSummary = Object.entries(tools)
    .map(([name, details]) => `  ${toolLabel(name).padEnd(16, " ")} ${details.description}`)
    .join("\n");

  const lines = [
    `${colorBlue}Mini Agent CLI${reset}`,
    "",
    section("Usage:"),
    "  node src/index.js [options]",
    "",
    section("Options:"),
    "  -h, --help    Show this help message and exit.",
    "",
    section("Interactive usage:"),
    `  ${colorRed}You >${reset} Ask a question or request a task`,
    `  ${colorBlue}Agent >${reset} Responds directly or uses tools when needed`,
    "  Press Ctrl+C to exit.",
    "",
    section("Available tools:"),
    toolsSummary,
  ];

  console.log(lines.join("\n"));
}

module.exports = { printHelp };