## 🤖 Mini Agent CLI — v1.0.0

First release! A lightweight CLI AI agent powered by Google Gemini that can interact with your filesystem through a simple tool-calling loop.

### What's included

- Interactive CLI chat loop
- 3 built-in tools: `readFile`, `writeFile`, `listDir`
- `TOOL:name:arg` protocol for Gemini tool-calling
- Multi-turn conversation with tool result injection
- `.env` support for API key management

### Quick start

```bash
git clone https://github.com/YOUR_USERNAME/mini-agent-cli.git
cd mini-agent-cli
npm install
cp .env.example .env   # then add your GEMINI_API_KEY
node index.js
```

### Dependencies

- `@google/genai` ^2.10.0
- `dotenv` ^17.4.2

---

**Full changelog:** [CHANGELOG.md](./CHANGELOG.md)
