const { askLLM } = require("./llm");
const { tools } = require("./tools");

const toolDescriptions = Object.entries(tools)
  .map(([name, details]) => {
    return `
    Tool Name: ${name}
    Description: ${details.description}
    Parameters:
    ${JSON.stringify(details.parameters, null, 2)}
    `;
  })
  .join("\n");

async function runAgent(userInput) {
  let messages = [
    {
      role: "system",
      content: `
      Your are a CLI AI agent assistance.
      You can use tools when needed to answer user questions.

      You can use ONLY the following tools.
      ${toolDescriptions}
    
      Rules:
      1. NEVER invent tool names.
      2. Use ONLY the tool names exactly as written.
      3. If a tool is needed, output ONLY:
      TOOL:<toolName>:<argument>

      Examples:
      TOOL:listDir:.
      TOOL:listDir:src
      TOOL:readFile:package.json

      If no tool is needed, answer normally.
      `,
    },
    { role: "user", content: userInput },
  ];

  const response = await askLLM(messages);

  if (response.startsWith("TOOL:")) {
    const [, toolName, arg] = response.split(":");

    const tool = tools[toolName];

    if (!tool) {
      return `Unknown tool "${toolName}".
      Available tools: ${Object.keys(tools).join(", ")}`;
    }

    const result = tool.func(arg);

    const final = await askLLM([
      ...messages,
      { role: "assistant", content: response },
      { role: "user", content: `Tool result: ${result}` },
    ]);

    return final;
  }

  return response;
}

module.exports = runAgent;
