# Contributing to Mini Agent CLI

Thanks for your interest in contributing! This is a learning project, so all kinds of improvements are welcome.

## How to Contribute

### Reporting Bugs

Open an issue using the **Bug Report** template. Include:

- What you did
- What you expected
- What actually happened
- Your Node.js version and OS

### Suggesting Features

Open an issue using the **Feature Request** template. Describe the idea and why it would be useful.

### Before Opening a PR

Before you start working on anything, please make sure 
the issue is assigned to you first.

1. Find an open issue you want to work on
2. Comment on it: "I'd like to work on this"
3. Wait for a maintainer to assign it to you
4. Only then fork the repo and open a PR

> ⚠️ PRs opened without a linked assigned issue may be 
> closed without review.

### Submitting a Pull Request

1. Fork the repo
2. Create a new branch: `git checkout -b feat/your-feature-name`
3. Make your changes
4. Commit with a clear message: `git commit -m "feat: add X tool"`
5. Push and open a PR against `main`

## Commit Message Convention

Use simple prefixes:

| Prefix      | When to use                                         |
| ----------- | --------------------------------------------------- |
| `feat:`     | New feature or tool                                 |
| `fix:`      | Bug fix                                             |
| `docs:`     | Documentation only                                  |
| `refactor:` | Code change that doesn't fix a bug or add a feature |
| `chore:`    | Dependency updates, config changes                  |

## Ideas for Contributions

- Add new tools (e.g., `runCommand`, `fetchURL`, `searchWeb`)
- Support multi-argument tool calls
- Add a proper tool-calling format (JSON instead of `TOOL:name:arg`)
- Add tests
- Add types
- Improve error handling

## Code Style

- Keep it simple and readable
- No TypeScript required — plain JS is fine
- Comment non-obvious logic
