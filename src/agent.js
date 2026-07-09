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
  if (!userInput.trim()) {
    return "Please Type Something...";
  }

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

  console.log("\x1b[41m [Agent Thinking...] \x1b[0m");
  const response = await askLLM(messages);

  if (response.startsWith("TOOL")) {
    // const jsonPart = response.replace("TOOL", "").trim().split("-");
    // [toolPart, reasonPart] = jsonPart;
    let toolPart;
    let reasonPart;
    let braceCount = 0;
    const text = response.replace("TOOL", "").trim();

    for (let i = 0; i < text.length; i++) {
      if (text[i] === "{") {
        braceCount++;
      } else if (text[i] === "}") {
        braceCount--;
        if (braceCount === 0 && text[i + 1] === "-") {
          toolPart = text.substring(0, i + 1);
          reasonPart = text.substring(i + 2);
          break;
        }
      }
    }

    const { name: toolName, args } = JSON.parse(toolPart);
    const { Reason: reason } = JSON.parse(reasonPart);

    const tool = tools[toolName];

    if (!tool) {
      return `Unknown tool "${toolName}"`;
    }

    console.log(`\x1b[42m [Reason: ${reason}] \x1b[0m`);
    console.log(`\x1b[43m [Choosing tool: ${toolName}] \x1b[0m`);

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
