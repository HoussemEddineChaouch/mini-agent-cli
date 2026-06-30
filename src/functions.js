const fs = require("fs");

function readFile(path) {
  return fs.readFileSync(path, "utf-8");
}

function writeFile(path, content) {
  fs.writeFileSync(path, content, "utf8");
  return "File written successfully";
}

function listDir(path = ".") {
  return fs.readdirSync(path);
}

module.exports = { readFile, writeFile, listDir };
