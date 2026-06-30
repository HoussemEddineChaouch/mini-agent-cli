const { askLLM } = require("./llm");
const { tools } = require("./tools");

const toolDescriptions = Object.entries(tools)
  .map(([name, details]) => {
    return `
    Tool Name: ${name}
    Description: ${details.description}
    Parameters:
    ${JSON.stringify(details.parameters)}
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
      TOOL {"name":"toolName","args":{...}}-{"Reason":"...."}

      Examples:
      TOOL {"name":"listDir","args":{"path":"."}}-{"Reason":"user wants folder content."}
      TOOL {"name":"readFile","args":{"path":"package.json"}}-{"Reason":"user wants file conetnt."}
      TOOL {"name":"writeFile","args":{"path":"test.txt","content":"hello"}}-{"Reason":"user want to write in teh file."}

      If no tool is needed, answer normally.
      `,
    },
    { role: "user", content: userInput },
  ];

  console.log("[Agent Thinking...]");
  const response = await askLLM(messages);

  if (response.startsWith("TOOL")) {
    const jsonPart = response.replace("TOOL", "").trim().split("-");
    [toolPart, reasonPart] = jsonPart;
    const { name: toolName, args } = JSON.parse(toolPart);
    const { Reason: reason } = JSON.parse(reasonPart);

    const tool = tools[toolName];

    if (!tool) {
      return `Unknown tool "${toolName}"`;
    }

    console.log(`[Reason: ${reason}]`);
    console.log(`[Choosing tool: ${toolName}]`);

    const result = tool.func(...Object.values(args));

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
