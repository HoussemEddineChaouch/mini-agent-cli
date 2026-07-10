const fs = require("fs");
const { convert } = require("html-to-text");
const { execSync } = require("child_process");

function readFile(path) {
  try {
    return fs.readFileSync(path, "utf-8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return `File "${path}" does not exist.`;
    }

    if (error.code === "EISDIR") {
      return `"${path}" is a directory, not a file.`;
    }

    throw error;
  }
}

function writeFile(path, content) {
  try {
    fs.writeFileSync(path, content, "utf8");
    return "File written successfully";
  } catch (error) {
    if (error.code === "ENOENT") {
      return `File "${path}" could not be written because its directory does not exist.`;
    }

    throw error;
  }
}

function listDir(path = ".") {
  try {
    return fs.readdirSync(path);
  } catch (error) {
    if (error.code === "ENOENT") {
      return `Directory "${path}" does not exist.`;
    }

    if (error.code === "ENOTDIR") {
      return `"${path}" is not a directory.`;
    }

    throw error;
  }
}

function fetchURL(url) {
  try {
    if (!url || typeof url !== "string") {
      return 'Invalid "url" argument.';
    }

    const escapedUrl = url.replace(/"/g, '\"');
    const body = execSync(
      'curl -L --max-time 10 -A "mini-agent-cli/1.0" "' + escapedUrl + '"',
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );

    const text = convert(body, {
      wordwrap: 120,
      selectors: [
        { selector: "script", format: "skip" },
        { selector: "style", format: "skip" },
        { selector: "noscript", format: "skip" }
      ],
      baseElements: { selectors: ["body"] }
    });

    return text.replace(/\n{3,}/g, "\n\n").trim().slice(0, 20000);
  } catch (error) {
    return "Failed to fetch URL.";
  }
}

module.exports = { readFile, writeFile, listDir, fetchURL };
