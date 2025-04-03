const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

exports.runCode = async (req, res) => {
  const { language, code, input } = req.body;

  // code is empty
  if (!code) {
    return res.status(400).json({ error: "Code is required", status: "ERROR" });
  }

  try {
    const filePath = await this.generateFile(language, code);
    const inputFilePath = await this.generateInputFile(input);
    const output = await this.executeCpp(filePath, inputFilePath);

    res.json({ filePath, inputFilePath, output, status: "SUCCESS" });
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

exports.generateInputFile = async (input) => {
  const dirInputs = path.join(__dirname, "../inputs");

  // if folder not exist then create folder
  if (!fs.existsSync(dirInputs)) {
    fs.mkdirSync(dirInputs, { recursive: true });
  }

  const jobId = uuidv4();
  const inputFileName = `${jobId}.txt`;
  const inputFilePath = path.join(dirInputs, inputFileName);
  await fs.writeFileSync(inputFilePath, input);

  return inputFilePath;
};

exports.executeCpp = (filePath, inputFilePath) => {
  const outputPathDir = path.join(__dirname, "../outputs");

  // if folder not exist then create folder
  if (!fs.existsSync(outputPathDir)) {
    fs.mkdirSync(outputPathDir);
  }

  const jobId = path.basename(filePath).split(".")[0];
  const isWindows = process.platform === "win32"; // Check if the OS is Windows
  const outPath = path.join(
    outputPathDir,
    `${jobId}${isWindows ? ".exe" : ""}`
  ); // Add .exe only for Windows

  return new Promise((resolve, reject) => {
    const runCommand = isWindows
      ? `g++ ${filePath} -o ${outPath} && cd ${outputPathDir} && .\\${jobId}.exe < ${inputFilePath}`
      : `g++ ${filePath} -o ${outPath} && ${outPath} < ${inputFilePath}`; // Linux command

    exec(runCommand, (error, stdout, stderr) => {
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
    });
  });
};
