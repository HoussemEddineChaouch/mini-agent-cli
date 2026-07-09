const fs = require("fs");
const { convert } = require("html-to-text");

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

async function fetchWebText(url) {
  try {
    if (!url || typeof url !== "string") {
      return 'Invalid "url" argument.';
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "mini-agent-cli/1.0",
      },
    });

    if (!response.ok) {
      return `Request failed with status ${response.status}.`;
    }

    const contentType = response.headers.get("content-type") || "";
    const body = await response.text();

    if (!contentType.includes("text/html")) {
      return body.slice(0, 20000);
    }

    const text = convert(body, {
      wordwrap: 120,
      selectors: [
        { selector: "script", format: "skip" },
        { selector: "style", format: "skip" },
        { selector: "noscript", format: "skip" },
      ],
      baseElements: { selectors: ["body"] },
    });

    // Cleans noisy spacing after conversion.
    const cleaned = text.replace(/\n{3,}/g, "\n\n").trim();
    
    return cleaned.slice(0, 20000);
  } catch (error) {
    if (error.name === "AbortError") {
      return "Request timed out.";
    }
    return `Failed to fetch URL: ${error.message}`;
  } finally {
    clearTimeout(timeoutId);
  }
}

module.exports = { readFile, writeFile, listDir, fetchWebText };
