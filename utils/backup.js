const { exec } = require("child_process");
const { format } = require("date-fns");

const backupDatabase = () => {
  const timestamp = format(new Date(), "yyyyMMddHHmmss");
  const backupFile = `backup_${timestamp}.sql`;
  const command = `pg_dump -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -F c ${process.env.DB_NAME} > ${backupFile}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error during backup: ${stderr}`);
      return;
    }
    console.log(`Backup successful: ${backupFile}`);
  });
};

module.exports = backupDatabase;
