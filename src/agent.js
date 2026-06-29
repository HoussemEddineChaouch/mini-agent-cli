const { askLLM } = require("./llm");
const { tools } = require("./tools");

async function runAgent(userInput) {
  let messages = [
    {
      role: "system",
      content: `
      Your are a CLI AI agent assistance.
      You can use tools when needed to answer user questions.

      Available tools:
      ${Object.entries(tools).map(([name, details]) => ({
        toolName: name,
        toolDetails: {
          description: details.description,
          parameters: JSON.stringify(details.parameters),
          func: details.func.toString(),
        },
      }))}
      If tool needed, respond like:
      TOOL:toolName:argument

      Otherwise respond normally.
      `,
    },
    { role: "user", content: userInput },
  ];

  const response = await askLLM(messages);

  if (response.startsWith("TOOL:")) {
    const [, toolName, arg] = response.split(":");
    console.error(tools[toolName].func(arg));
    const result = tools[toolName].func(arg);

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
