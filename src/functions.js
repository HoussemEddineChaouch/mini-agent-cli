const fs = require("fs");

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

module.exports = { readFile, writeFile, listDir };
