const { join } = require("path");
const { spawnSync } = require("child_process");
const isWin = process.platform === "win32";

const venvDir = join(process.cwd(), "venv");
const pyExe = isWin ? "python" : "python3";
const pip = isWin ? join("venv", "Scripts", "pip.exe") : join("venv", "bin", "pip");
const reqFile = join("ai-tools", "requirements.txt");

function run(cmd, args) {
  const r = spawnSync(cmd, args, { stdio: "inherit", shell: false });
  if (r.status !== 0) process.exit(r.status);
}

// create venv
run(pyExe, ["-m", "venv", "venv"]);

// install deps
run(pip, ["install", "-r", reqFile]);
