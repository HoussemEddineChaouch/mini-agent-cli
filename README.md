<p align="center">
  <img src="/site/assets/main-logo-square.png" alt="Mini Agent CLI" width="200"/>
</p>

<h1 align="center">mini-agent-cli</h1>

<p align="center">
  <code>> think. act. observe. answer.</code>
</p>

<p align="center">
  <a href="https://github.com/HoussemEddineChaouch/mini-agent-cli/releases">
    <img src="https://img.shields.io/github/v/release/HoussemEddineChaouch/mini-agent-cli?color=22c55e&label=version&style=flat-square" alt="version"/>
  </a>
  <a href="https://github.com/HoussemEddineChaouch/mini-agent-cli/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/HoussemEddineChaouch/mini-agent-cli?color=8b5cf6&style=flat-square" alt="license"/>
  </a>
  <a href="https://github.com/HoussemEddineChaouch/mini-agent-cli/stargazers">
    <img src="https://img.shields.io/github/stars/HoussemEddineChaouch/mini-agent-cli?color=fcd34d&style=flat-square" alt="stars"/>
  </a>
  <a href="https://github.com/HoussemEddineChaouch/mini-agent-cli/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/HoussemEddineChaouch/mini-agent-cli?color=f472b6&style=flat-square" alt="contributors"/>
  </a>
  <a href="https://github.com/HoussemEddineChaouch/mini-agent-cli/issues">
    <img src="https://img.shields.io/github/issues/HoussemEddineChaouch/mini-agent-cli?color=60a5fa&style=flat-square" alt="issues"/>
  </a>
  <a href="https://mini-agent-cli.vercel.app">
    <img src="https://img.shields.io/badge/site-live-22c55e?style=flat-square" alt="site"/>
  </a>
</p>

<p align="center">
A lightweight CLI AI agent that can read files, write files, list directories and run commands — powered by <strong>Google Gemini</strong> via a simple tool-calling loop.
</p>

<p align="center">
Built as a hands-on practice project for understanding how AI agents work under the hood.
</p>

---

## Features

- Interactive CLI chat loop with **colored output**
- Tool-calling system (read, write, list files, run commands)
- Agent reasoning display — shows _why_ a tool was chosen
- Multi-turn conversation with tool result injection
- Conversation history across turns for context-aware follow-up answers.
- `--help` / `-h` flag — display usage info and available tools without starting the agent
- Powered by `gemini-2.5-flash`

---

## Project Structure

```
mini-agent-cli/
├── src/
│   ├── agent.js       # Core agent loop (JSON tool detection + LLM calls)
│   ├── llm.js         # Gemini API wrapper
│   ├── tools.js       # Tool registry (metadata + functions)
│   ├── functions.js   # Actual tool implementations (fs operations)
│   └── index.js       # CLI entry point (colored readline interface)
├── .env.example       # Environment variable template
├── CHANGELOG.md
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
node src/index.js
```

### Show help

```bash
node src/index.js --help
# or
node src/index.js -h
```

Displays all available tools, usage instructions, and options without starting the agent.

---

## How It Works

1. User types a message in the CLI
2. The agent sends it to Gemini with a system prompt listing available tools
   If Gemini decides a tool is needed, it responds with a JSON tool call:

```
TOOL {"name":"listDir","args":{"path":"."}}-{"Reason":"user wants folder content."}
```

4. The agent parses the JSON, logs the **reason** and **chosen tool**, executes it, and sends the result back to Gemini
5. Gemini returns a final natural-language answer

```mermaid
flowchart TD
    A[User input] --> B{Gemini decides}
    B -->|Tool needed| C[TOOL call in JSON]
    C --> D[Parse JSON]
    D --> E[Run tool]
    E --> F[Send result to Gemini]
    F --> G[Final natural-language answer]
    B -->|No tool needed| G
```

---

**Colored CLI output:**

| Color     | Meaning                                   |
| --------- | ----------------------------------------- |
| 🔴 Red    | Your input prompt (`You >`)               |
| 🔵 Blue   | Agent response (`Agent >`)                |
| 🟡 Yellow | Chosen tool name                          |
| 🟢 Green  | Agent reasoning (why it picked that tool) |

## Available Tools

| Tool         | Description                                               |
| ------------ | --------------------------------------------------------- |
| `readFile`   | Reads the contents of a file from disk                    |
| `writeFile`  | Writes or overwrites a file on disk                       |
| `appendFile` | Appends content to a file on disk.                        |
| `deleteFile` | Deletes a file from disk                                  |
| `listDir`    | Lists all files in a directory                            |
| `fetchURL`   | Fetches the content of a URL and returns it as plain text |
| `runCommand` | Executes a shell command and returns the output           |

---

## Dependencies

| Package         | Purpose                                |
| --------------- | -------------------------------------- |
| `@google/genai` | Google Gemini API client               |
| `dotenv`        | Load environment variables from `.env` |
| `html-to-text`  | Convert HTML responses to plain text   |

---

## Contributing

Contributions, ideas, and bug reports are welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

## Contributors

Thanks to everyone who has contributed to this project 🙌

<a href="https://github.com/HoussemEddineChaouch/mini-agent-cli/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HoussemEddineChaouch/mini-agent-cli" />
</a>

---

## License

MIT — see [LICENSE](LICENSE) for details.
