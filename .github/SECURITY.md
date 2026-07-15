# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x.x   | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not open a public issue**.

Instead, report it privately by emailing:

📧 **chaouch.eddinehoussem@gmail.com**

Please include:

- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fix if you have one

I'll respond within **48 hours** and work with you to fix it before any public disclosure.

## Known Security Considerations

- The `runCommand` tool executes shell commands directly — never run the agent with untrusted input
- API keys are loaded from `.env` — never commit your `.env` file
- The `fetchURL` tool fetches external URLs — be careful with untrusted URLs

## Scope

This is a open-source project. Security reports related to:

- Exposed API keys
- Command injection via `runCommand`
- Unsafe file operations

are all taken seriously and will be addressed promptly.
