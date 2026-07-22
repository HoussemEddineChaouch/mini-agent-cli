const fs = require("fs");
const pathModule = require("path");
const { convert } = require("html-to-text");
const { execSync } = require("child_process");

function readFile(path) {
  let filePath = path;

  if (!fs.existsSync(filePath) && pathModule.extname(filePath) === "") {
    const extensions = [".js", ".ts", ".json", ".jsx", ".tsx"];

    for (const ext of extensions) {
      const candidate = filePath + ext;

      if (fs.existsSync(candidate)) {
        filePath = candidate;
        break;
      }
    }
  }

  try {
    return fs.readFileSync(filePath, "utf-8");
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

function deleteFile(path) {
  try {
    fs.unlinkSync(path);
    return "File deleted successfully";
  } catch (error) {
    if (error.code === "ENOENT") {
      return `File "${path}" does not exist.`;
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

    const escapedUrl = url.replace(/"/g, '\\"');
    const body = execSync(
      'curl -L --max-time 10 -A "mini-agent-cli/1.0" "' + escapedUrl + '"',
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );

    const text = convert(body, {
      wordwrap: 120,
      selectors: [
        { selector: "script", format: "skip" },
        { selector: "style", format: "skip" },
        { selector: "noscript", format: "skip" },
      ],
      baseElements: { selectors: ["body"] },
    });

    return text
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 20000);
  } catch (error) {
    return "Failed to fetch URL.";
  }
}

function searchWeb(query) {
  try {
    if (!query || typeof query !== "string") {
      return 'Invalid "query" argument.';
    }

    const escapedQuery = encodeURIComponent(query);
    const url = `https://search.yahoo.com/search?q=${escapedQuery}`;
    const body = execSync(
      `curl -L --max-time 10 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" "${url}"`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
    );

    const text = convert(body, {
      wordwrap: 120,
      selectors: [
        { selector: "script", format: "skip" },
        { selector: "style", format: "skip" },
        { selector: "noscript", format: "skip" },
      ],
      baseElements: { selectors: ["body"] },
    });

    return text
      .replace(/\n{3,}/g, "\n\n")
      .trim()
      .slice(0, 20000);
  } catch (error) {
    return "Failed to perform web search.";
  }
}

function runCommand(command) {
  if (!command || typeof command !== "string") {
    return 'Invalid "command" argument.';
  }

  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 10000,
    });

    return output.trim().slice(0, 20000) || "Command completed with no output.";
  } catch (error) {
    if (typeof error.status === "number") {
      const stderr = error.stderr?.toString().trim();
      const stdout = error.stdout?.toString().trim();

      if (stderr) return `Command failed: ${stderr}`;
      if (stdout) return stdout;

      return `Command failed with exit code ${error.status}.`;
    }

    if (error.code === "ETIMEDOUT") return "Command timed out.";

    throw error;
  }
}

module.exports = { readFile, writeFile, deleteFile, listDir, fetchURL, runCommand, searchWeb };

