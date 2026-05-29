import path from "path";
import fs from "fs";
import { spawn, exec } from "child_process";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import { PDFParse } from "pdf-parse";

// --- PYTHON FLASK COMPANION SERVICE DAEMON ---
let flaskProcess = null;
const logFilePath = path.resolve("python-ml-service", "output.log");

try {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
  fs.writeFileSync(logFilePath, `=== Boot Session: ${new Date().toISOString()} ===\n`);
} catch (e) {
  console.error("Failed to initialize daemon log file:", e);
}

export function logToFile(msg) {
  try {
    fs.appendFileSync(logFilePath, `${msg}\n`);
    console.log(msg);
  } catch (e) {
    console.error("Failed writing to output.log:", e);
  }
}

export function spawnFlaskService() {
  logToFile("[SERVER INITIALIZER] Spawning companion Python Flask ML prediction service...");
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  const scriptPath = path.resolve("python-ml-service", "app.py");

  try {
    flaskProcess = spawn(pythonCmd, [scriptPath], {
      stdio: "pipe",
      shell: true
    });
    
    flaskProcess.stdout.on("data", (data) => {
      logToFile(`[FLASK STDOUT] ${data.toString().trim()}`);
    });
    
    flaskProcess.stderr.on("data", (data) => {
      logToFile(`[FLASK STDERR] ${data.toString().trim()}`);
    });

    flaskProcess.on("error", (err) => {
      logToFile(`❌ [SERVER INITIALIZER] Failed to spin up Flask process: ${err.message}`);
    });
    
    flaskProcess.on("exit", (code) => {
      if (code !== 0 && code !== null) {
        logToFile(`⚠️ [SERVER INITIALIZER] Flask process exited with code ${code}.`);
      } else {
        logToFile(`[SERVER INITIALIZER] Flask process exited cleanly.`);
      }
    });
  } catch (err) {
    logToFile(`❌ [SERVER INITIALIZER] Exception during spawn: ${err.message}`);
  }
}

export async function initPythonAndFlask() {
  logToFile("[PYTHON INIT] Checking Python environment and automated Scikit-learn setup...");
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  const reqPath = path.resolve("python-ml-service", "requirements.txt");

  await new Promise((resolve) => {
    exec(`${pythonCmd} --version`, (err, stdout, stderr) => {
      if (err) {
        logToFile(`❌ [PYTHON INIT] Python is not found, or not accessible via ${pythonCmd}: ${err.message}`);
      } else {
        logToFile(`[PYTHON INIT] Python command active: ${(stdout || "").trim() || (stderr || "").trim()}`);
      }
      resolve();
    });
  });

  // Bootstrap pip if not present
  let hasPip = false;
  await new Promise((resolve) => {
    exec(`${pythonCmd} -m pip --version`, async (err, stdout, stderr) => {
      if (err) {
        logToFile("[PYTHON INIT] pip module not detected. Attempting to bootstrap ensurepip or get-pip.py...");
        
        // Try ensurepip first
        logToFile("[PYTHON INIT] Attempting Python ensurepip module boot...");
        await new Promise((res) => {
          exec(`${pythonCmd} -m ensurepip --default-pip`, (ensureErr, ensureStdout, ensureStderr) => {
            if (ensureErr) {
              logToFile(`[PYTHON INIT] ensurepip failed: ${ensureErr.message}. Attempting external get-pip.py download...`);
              res(false);
            } else {
              logToFile("[PYTHON INIT] ensurepip bootstrap succeeded!");
              hasPip = true;
              res(true);
            }
          });
        });

        if (!hasPip) {
          try {
            logToFile("[PYTHON INIT] Downloading get-pip.py installer...");
            const getPipRes = await axios.get("https://bootstrap.pypa.io/get-pip.py", { responseType: 'text' });
            const getPipPath = path.resolve("python-ml-service", "get-pip.py");
            fs.writeFileSync(getPipPath, getPipRes.data);
            
            logToFile("[PYTHON INIT] Running get-pip.py installer...");
            await new Promise((res) => {
              exec(`${pythonCmd} "${getPipPath}" --user --break-system-packages`, (pipInstallerErr, pipInstallerStdout, pipInstallerStderr) => {
                if (pipInstallerErr) {
                  logToFile(`❌ [PYTHON INIT] get-pip.py installer failed: ${pipInstallerErr.message}. Trying without break-system-packages...`);
                  exec(`${pythonCmd} "${getPipPath}" --user`, (pErr) => {
                    if (pErr) {
                       logToFile(`❌ [PYTHON INIT] get-pip.py fallback failed: ${pErr.message}`);
                       res(false);
                    } else {
                       logToFile("[PYTHON INIT] get-pip.py fallback succeeded!");
                       res(true);
                    }
                  });
                } else {
                  logToFile("[PYTHON INIT] get-pip.py installer succeeded!");
                  res(true);
                }
              });
            });
            hasPip = true;
            try {
              fs.unlinkSync(getPipPath);
            } catch (unlinkErr) {}
          } catch (downloadErr) {
            logToFile(`❌ [PYTHON INIT] Failed to download or run get-pip.py: ${downloadErr.message}`);
          }
        }
      } else {
        logToFile(`[PYTHON INIT] Pip already active: ${stdout.trim()}`);
        hasPip = true;
      }
      resolve();
    });
  });

  logToFile("[PYTHON INIT] Installing pip packages for Scikit-learn prediction engine...");
  const installCmd = `${pythonCmd} -m pip install -r "${reqPath}" --user --break-system-packages --no-cache-dir || ${pythonCmd} -m pip install -r "${reqPath}" --user --no-cache-dir || ${pythonCmd} -m pip install -r "${reqPath}" --break-system-packages --no-cache-dir || ${pythonCmd} -m pip install -r "${reqPath}" --no-cache-dir || pip3 install -r "${reqPath}" --user --break-system-packages --no-cache-dir || pip install -r "${reqPath}" --user --break-system-packages --no-cache-dir`;
  
  await new Promise((resolve) => {
    const installProc = exec(installCmd, (err, stdout, stderr) => {
      if (err) {
        logToFile(`[PYTHON INIT] Pip installation issue, proceeding to boot Flask and inspect logs: ${err.message}`);
      } else {
        logToFile("[PYTHON INIT] Python dependencies verified & installed successfully!");
      }
      resolve();
    });

    if (installProc.stdout) {
      installProc.stdout.on("data", (data) => logToFile(`[PIP LOG] ${data.toString().trim()}`));
    }
    if (installProc.stderr) {
      installProc.stderr.on("data", (data) => logToFile(`[PIP ERR] ${data.toString().trim()}`));
    }
  });

  spawnFlaskService();
}


// --- GEMINI SERVICE ---
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { headers: { "User-Agent": "aistudio-build" } }
});

export let isGeminiBypassed = !process.env.GEMINI_API_KEY;

export function checkGeminiError(err) {
  const errStr = (JSON.stringify(err) + " " + String(err?.message || "") + " " + String(err || "")).toLowerCase();
  if (errStr.includes("leaked") || errStr.includes("permission_denied") || errStr.includes("403") || errStr.includes("api key")) {
    if (!isGeminiBypassed) {
      console.warn("[GEMINI CONFIG] Leaked or invalid API key detected. Activating permanent offline bypass for this session.");
      isGeminiBypassed = true;
    }
    return true;
  }
  return false;
}

export function setGeminiBypassed(val) {
  isGeminiBypassed = val;
}


// --- PDF & RESUME LOCAL PARSING ---
export const parsePDFText = async (dataBuffer) => {
  const parser = new PDFParse({ data: dataBuffer });
  try {
    const textResult = await parser.getText();
    return textResult && typeof textResult.text === "string" ? textResult.text : "";
  } catch (err) {
    console.error("[parsePDFText] parsing failed:", err);
    throw err;
  } finally {
    try {
      await parser.destroy();
    } catch (_) {}
  }
};

export function runLocalResumeParser(text) {
  const normText = (text || "").toLowerCase();
  const skillUniverse = [
    { name: "React", keys: ["react", "reactjs", "react.js"] },
    { name: "Angular", keys: ["angular", "angularjs"] },
    { name: "Vue", keys: ["vue", "vuejs"] },
    { name: "HTML/CSS", keys: ["html", "html5", "css", "css3", "tailwind", "bootstrap"] },
    { name: "JavaScript/TypeScript", keys: ["javascript", "js", "typescript", "ts"] },
    { name: "Node.js/Express", keys: ["node", "nodejs", "node.js", "express"] },
    { name: "Python/Django/Flask", keys: ["python", "py", "django", "flask", "fastapi"] },
    { name: "Java/Spring", keys: ["java", "spring", "springboot"] },
    { name: "C++/C#", keys: ["c\\+\\+", "c#", "c-sharp"] },
    { name: "Go/Rust", keys: ["golang", "go", "rust"] },
    { name: "Databases", keys: ["mongodb", "mongo", "sql", "postgresql", "postgres", "mysql", "sqlite", "firebase", "firestore", "redis"] },
    { name: "Cloud/DevOps", keys: ["aws", "amazon", "docker", "kubernetes", "k8s", "git", "github", "gitlab", "ci/cd", "graphql", "linux"] }
  ];

  const extractedSkills = [];
  skillUniverse.forEach(s => {
    if (s.keys.some(k => new RegExp('\\b' + k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'i').test(normText))) {
      extractedSkills.push(s.name);
    }
  });
  if (!extractedSkills.length) extractedSkills.push("HTML", "CSS", "JavaScript", "Communication");

  const hasExp = /experience|work|internship/i.test(normText);
  const hasProj = /project|github/i.test(normText);
  const hasEdu = /education|university|college|btech|cgpa/i.test(normText);
  const hasContact = /email|phone|@|contact/i.test(normText);

  let score = Math.max(45, Math.min(55 + (extractedSkills.length * 4) + (hasExp ? 5 : 0) + (hasProj ? 5 : 0) + (hasEdu ? 5 : 0) + (hasContact ? 5 : 0), 94));
  const missingKeywords = ["Docker", "Kubernetes", "CI/CD Pipelines", "System Architecture", "Microservices", "Unit Testing", "Redis Caching", "AWS S3/EC2"].filter(k => !normText.includes(k.toLowerCase())).slice(0, 4);

  const improvements = [];
  if (!hasContact) improvements.push("Add essential contact info (Email, Phone, LinkedIn, GitHub) clearly in the top header.");
  if (!/git/i.test(normText)) improvements.push("Set up Git version control fields and insert deep-links directly matching your main repositories.");
  if (normText.length < 800) improvements.push("Elaborate further on academic achievements to improve keyword matching density.");
  if (improvements.length < 2) {
    improvements.push("Quantify your bullet points (e.g., 'Improved performance by 20%') to demonstrate measurable impact.", "Structure your resume format to highlight developer technologies explicitly under each project title.");
  }

  const recommendedProjects = [];
  if (/react|javascript/i.test(normText)) recommendedProjects.push("System-Wide Real-time Dashboard: Implement responsive telemetry panel using Recharts.");
  if (/node|python|express/i.test(normText)) recommendedProjects.push("Scalable Async Request Broker: Build task queue service using Express and Redis caching.");
  if (recommendedProjects.length < 3) recommendedProjects.push("Interactive Developer Portfolio: Build Next.js site with custom motion animations.");
  if (recommendedProjects.length < 3) recommendedProjects.push("Database Synchronization Daemon: Design automated syncing script between DB layers.");

  return { atsScore: score, extractedSkills, missingKeywords, improvements: improvements.slice(0, 4), recommendedProjects: recommendedProjects.slice(0, 3) };
}
