const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const timeout = require("promise-timeout");

exports.executeCode = async (req, res) => {
  const { language, code } = req.body;

  let command;

  switch (language) {
    case "javascript":
      command = `node -e "${code}"`;
      break;
    case "python":
      command = `python -c "${code}"`;
      break;
    case "lua":
      command = `lua -e "${code}"`;
      break;
    case "c++":
      const filePath = path.join("/tmp", "main.cpp");
      fs.writeFileSync(filePath, code);
      command = `g++ ${filePath} -o /tmp/a.out && /tmp/a.out`;
      break;
    default:
      return res.status(400).json({ error: "Unsupported language" });
  }

  try {
    const result = await timeout.exec(command, {
      timeout: parseDuration(process.env.EXECUTION_TIME_LIMIT),
    });
    res.json({ output: result.stdout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

function parseDuration(duration) {
  const match = duration.match(/^(\d+)([mhd])$/);
  if (match) {
    const value = parseInt(match[1], 10);
    switch (match[2]) {
      case "m":
        return value * 60 * 1000; // milliseconds
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return value * 1000;
    }
  }
  return 10000; // Default to 10 seconds if invalid duration
}
