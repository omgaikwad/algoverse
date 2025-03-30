const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

exports.runCode = async (req, res) => {
  const { language, code } = req.body;

  // code is empty
  if (!code) {
    return res.status(400).json({ error: "Code is required", status: "ERROR" });
  }

  try {
    const filePath = await this.generateFile(language, code);
    const output = await this.executeCpp(filePath);

    res.json({ filePath, output, status: "SUCCESS" });
  } catch (error) {
    console.log("Error in Running Code", error);
    res.status(500).json({ error: "Internal Server", status: "ERROR" });
  }
};

exports.generateFile = async (format, content) => {
  const dirCodes = path.join(__dirname, "../codes");

  // if folder not exist then create folder
  if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes);
  }

  const jobId = uuidv4();
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, content);

  return filePath;
};

exports.executeCpp = (filePath) => {
  const outputPathDir = path.join(__dirname, "../outputs");

  // if folder not exist then create folder
  if (!fs.existsSync(outputPathDir)) {
    fs.mkdirSync(outputPathDir);
  }

  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPathDir, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outPath} && cd ${outputPathDir} && .\\${jobId}.exe`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(
            "🚀 ~ file: compilerController.js ~ line 85 ~ exec ~ error",
            error
          );
          reject({ error, stderr });
        }

        if (stderr) {
          console.log(
            "🚀 ~ file: compilerController.js ~ line 85 ~ exec ~ stderr",
            stderr
          );
          reject(stderr);
        }

        resolve(stdout);
      }
    );
  });
};
