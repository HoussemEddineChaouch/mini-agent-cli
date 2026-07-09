const funcs = require("./functions");

const tools = {
  readFile: {
    description: "Reads the contents of a file from the disk.",
    parameters: {
      path: {
        type: "STRING",
        description: "The path of the file in the disk, e.g. ~/home/resume.txt",
      },
    },
    func: funcs.readFile,
  },
  writeFile: {
    description: "Writes or overwrites content to a file on the disk.",
    parameters: {
      path: {
        type: "STRING",
        description: "The path of the file in the disk, e.g. ~/home/resume.txt",
      },
      content: {
        type: "STRING",
        description:
          "The content must be append in the file, e.g. `Hello, World!` ",
      },
    },
    func: funcs.writeFile,
  },
  listDir: {
    description: "Lists all the files contained in a specific directory.",
    parameters: {
      path: {
        type: "STRING",
        description:
          "The path of the directory in the disk, e.g. ~/home/backend",
      },
    },
    func: funcs.listDir,
  },
  fetchWebText: {
    description:
      "Fetches the text content from a given URL, excluding HTML tags.",
    parameters: {
      url: {
        type: "STRING",
        description: "The URL of the webpage to fetch text from.",
      },
    },
    func: funcs.fetchWebText,
  },
};

module.exports = { tools };
