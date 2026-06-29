# Changelog

All notable changes to this project will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project uses [Semantic Versioning](https://semver.org/).

---

## [1.0.0] - 2026-06-30

### Added
- Interactive CLI chat loop via `readline`
- `readFile` tool — reads any file from disk
- `writeFile` tool — writes/overwrites a file on disk
- `listDir` tool — lists files in a directory
- Gemini `gemini-2.5-flash` integration via `@google/genai`
- Simple `TOOL:name:arg` protocol for tool-calling
- Multi-turn conversation with tool result injection
- `.env` support via `dotenv`