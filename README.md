# Mini Agent CLI

A lightweight CLI AI agent that can read files, write files, and list directories — powered by **Google Gemini** via a simple tool-calling loop.

Built as a hands-on practice project for understanding how AI agents work under the hood.

---

## Features

- Interactive CLI chat loop
- Tool-calling system (read, write, list files)
- Multi-turn conversation with tool result injection
- Powered by `gemini-2.5-flash`

---

## Project Structure

```
mini-agent-cli/
├── agent.js       # Core agent loop (tool detection + LLM calls)
├── llm.js         # Gemini API wrapper
├── tools.js       # Tool registry (metadata + functions)
├── functions.js   # Actual tool implementations (fs operations)
├── index.js       # CLI entry point (readline interface)
├── .env.example   # Environment variable template
└── package.json
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/HoussemEddineChaouch/mini-agent-cli.git
cd mini-agent-cli
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then open `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

> Get a free key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

### 4. Run the agent

```bash
node index.js
```

---

## How It Works

1. User types a message in the CLI
2. The agent sends it to Gemini with a system prompt listing available tools
3. If Gemini responds with `TOOL:toolName:argument`, the agent:
   - Executes the tool function
   - Sends the result back to Gemini
   - Returns Gemini's final answer
4. Otherwise, the response is returned directly

```
User input
    │
    ▼
Gemini (with tool context)
    │
    ├─ TOOL:readFile:./notes.txt ──► run tool ──► send result back ──► Gemini ──► final answer
    │
    └─ Normal response ──► final answer
```

---

## Available Tools

| Tool        | Description                            |
| ----------- | -------------------------------------- |
| `readFile`  | Reads the contents of a file from disk |
| `writeFile` | Writes or overwrites a file on disk    |
| `listDir`   | Lists all files in a directory         |

---

## Dependencies

| Package         | Purpose                                |
| --------------- | -------------------------------------- |
| `@google/genai` | Google Gemini API client               |
| `dotenv`        | Load environment variables from `.env` |

---

## Contributing

Contributions, ideas, and bug reports are welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

---

## License

MIT — see [LICENSE](LICENSE) for details.
