const Docker = require("dockerode");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const docker = new Docker();
const codeDir = path.join(__dirname, "..", "..", "code");

if (!fs.existsSync(codeDir)) {
  fs.mkdirSync(codeDir);
}

const dockerImages = {
  javascript: "node:14-alpine",
  python: "python:3.8-alpine",
  lua: "lua:5.3-alpine",
  cpp: "gcc:latest",
  curl: "curlimages/curl",
};

function getFileExtension(language) {
  switch (language) {
    case "javascript":
      return "js";
    case "python":
      return "py";
    case "lua":
      return "lua";
    case "cpp":
      return "cpp";
    default:
      return "";
  }
}

function getRunCommand(language, fileName) {
  switch (language) {
    case "javascript":
      return `node /${fileName}`;
    case "python":
      return `python /${fileName}`;
    case "lua":
      return `lua /${fileName}`;
    case "cpp":
      return `g++ /${fileName} -o /tmp/a.out && /tmp/a.out`;
    case "curl":
      return `curl ${fileName}`; // assuming the code is the URL for curl
    default:
      return "";
  }
}

const runCodeInDocker = (language, code) => {
  return new Promise((resolve, reject) => {
    const fileId = uuidv4();
    const fileName = `${fileId}.${getFileExtension(language)}`;
    const filePath = path.join(codeDir, fileName);

    fs.writeFileSync(filePath, code);

    docker.run(
      dockerImages[language],
      ["sh", "-c", getRunCommand(language, fileName)],
      process.stdout,
      {
        Tty: false,
        HostConfig: {
          Memory: process.env.MEMORY_LIMIT,
          CpuShares: process.env.CPU_LIMIT,
          Binds: [`${filePath}:/${fileName}`],
          Runtime: "runsc",
          AutoRemove: true,
        },
      },
      (err, data, container) => {
        fs.unlinkSync(filePath);
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  });
};

module.exports = {
  runCodeInDocker,
};
