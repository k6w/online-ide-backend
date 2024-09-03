const { exec } = require("child_process");

exports.executeCurl = (req, res) => {
  const { url, method, headers, data } = req.body;

  let command = `curl -X ${method} ${url}`;

  if (headers) {
    command += ` -H "${headers}"`;
  }

  if (data) {
    command += ` -d "${data}"`;
  }

  exec(command, { shell: "/bin/sh" }, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr });
    }
    res.json({ output: stdout });
  });
};
