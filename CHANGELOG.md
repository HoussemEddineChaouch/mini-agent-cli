# Changelog

All notable changes to this project will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project uses [Semantic Versioning](https://semver.org/).

---

## [1.1.1] - 2026-07-09

### Fixed

- Parser no longer breaks when filenames contain dashes (#1)
- Added error handling for failed Gemini API calls (#2)
- Agent no longer crashes when readFile is called on a non-existent file (#4)
- Empty user input no longer sends a request to Gemini (#5)
- Agent now exits cleanly on Ctrl+C with a goodbye message (#6)

### Contributors

Thanks to everyone who contributed to this release 🙌

- @bhalsingh28
- @abusnitsky
- @Prasiddhi26

## [1.1.0] - 2026-07-05

### Added

- Colored CLI output — red for user input, blue for agent response, yellow for tool name, green for reasoning
- Agent thinking indicator shown while waiting for Gemini response
- Logo CLI in README header

### Changed

- Tool-calling protocol upgraded from string-based to JSON-based
  - Old: `TOOL:toolName:argument`
  - New: `TOOL {"name":"toolName","args":{...}}-{"Reason":"..."}`
- Agent now logs the reason Gemini chose a tool before executing it
- Tool prompt generation extracted into a clean `toolDescriptions` builder
- `writeFile` encoding explicitly set to `utf8`
- Files moved into `src/` directory
- README updated to reflect all v1.1.0 changes

### Fixed

- Parsing now correctly handles multiple JSON objects in a single TOOL response

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
