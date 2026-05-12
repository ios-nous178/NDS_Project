#!/usr/bin/env node
/**
 * Build a Windows-friendly MCP bundle:
 * - packages/mcp/dist + manifest.json
 * - local-packages/*.tgz
 * - .cmd launch/update helpers
 * - production node_modules for MCP runtime dependencies
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_ROOT = path.join(ROOT, "dist-win");
const BUNDLE_NAME = "NudgeEAPDesignSystem-Windows";
const BUNDLE_DIR = path.join(OUT_ROOT, BUNDLE_NAME);
const ZIP_PATH = path.join(OUT_ROOT, `${BUNDLE_NAME}.zip`);

const skipBuild = process.argv.includes("--no-build");
const skipInstall = process.argv.includes("--no-install");
const skipZip = process.argv.includes("--no-zip");

const runtimeDeps = [
  "@babel/parser",
  "@babel/traverse",
  "@babel/types",
  "@modelcontextprotocol/sdk",
];
const requiredLocalPackages = ["tokens", "react", "icons"];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeIfExists(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
  }
}

function copyFile(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      copyFile(srcPath, destPath);
    }
  }
}

function writeFile(file, contents) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, contents.replace(/\n/g, "\r\n"), "utf-8");
}

function run(command, args, options = {}) {
  console.log(`$ ${[command, ...args].join(" ")}`);
  execFileSync(command, args, { cwd: ROOT, stdio: "inherit", ...options });
}

function removeMacMetadata(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.name === ".DS_Store" || entry.name === "__MACOSX") {
      fs.rmSync(entryPath, { recursive: true, force: true });
    } else if (entry.isDirectory()) {
      removeMacMetadata(entryPath);
    }
  }
}

function getLocalPackageFile(name) {
  const pkg = readJson(path.join(ROOT, "packages", name, "package.json"));
  const fileName = `nudge-eap-${name}-${pkg.version}.tgz`;
  const filePath = path.join(ROOT, "local-packages", fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${path.relative(ROOT, filePath)}. Run pnpm release:local first.`);
  }
  return fileName;
}

if (!skipBuild) {
  run("pnpm", ["release:local"]);
  run("pnpm", ["build", "--filter", "@nudge-eap/mcp"]);
}

const mcpPkg = readJson(path.join(ROOT, "packages/mcp/package.json"));
const rootPkg = readJson(path.join(ROOT, "package.json"));
const requiredNodeVersion = rootPkg.volta?.node ?? rootPkg.engines?.node?.replace(/\.x$/, ".0");
const deps = Object.fromEntries(runtimeDeps.map((name) => [name, mcpPkg.dependencies[name]]));

removeIfExists(BUNDLE_DIR);
ensureDir(BUNDLE_DIR);
ensureDir(OUT_ROOT);

copyDir(path.join(ROOT, "packages/mcp/dist"), path.join(BUNDLE_DIR, "packages/mcp/dist"));
copyFile(
  path.join(ROOT, "packages/mcp/manifest.json"),
  path.join(BUNDLE_DIR, "packages/mcp/manifest.json"),
);
copyDir(path.join(ROOT, "local-packages"), path.join(BUNDLE_DIR, "local-packages"));

const localPackageFiles = Object.fromEntries(
  requiredLocalPackages.map((name) => [name, getLocalPackageFile(name)]),
);

fs.writeFileSync(
  path.join(BUNDLE_DIR, "package.json"),
  `${JSON.stringify(
    {
      name: "nudge-eap-ds-windows-bundle",
      private: true,
      type: "module",
      scripts: {
        start: "node packages/mcp/dist/server.js",
      },
      dependencies: deps,
    },
    null,
    2,
  )}\n`,
  "utf-8",
);

writeFile(
  path.join(BUNDLE_DIR, "nudge-eap-mcp.cmd"),
  `@echo off
set DIR=%~dp0
node "%DIR%packages\\mcp\\dist\\server.js"
`,
);

writeFile(
  path.join(BUNDLE_DIR, "update-mcp.cmd"),
  `@echo off
set DIR=%~dp0
set ZIP=%~1

echo NudgeEAP Design System bundle update
echo.
echo Before updating, close Claude/Codex.
echo.
if "%ZIP%"=="" (
  echo Tip: You can drag the latest NudgeEAPDesignSystem-Windows.zip onto this file.
  echo.
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%DIR%update-mcp.ps1" -ZipPath "%ZIP%" -TargetDir "%DIR%"
if errorlevel 1 (
  echo.
  echo Update failed. Check the error above.
  pause
  exit /b 1
)

echo.
pause
`,
);

writeFile(
  path.join(BUNDLE_DIR, "install-ds-packages.cmd"),
  `@echo off
set DIR=%~dp0
call "%DIR%setup-env.cmd" --no-pause
if errorlevel 1 exit /b 1
echo Run this file from a mockup project root.
echo Installing local DS .tgz packages from: %DIR%local-packages
pnpm add "%DIR%local-packages\\${localPackageFiles.tokens}" "%DIR%local-packages\\${localPackageFiles.react}" "%DIR%local-packages\\${localPackageFiles.icons}"
`,
);

writeFile(
  path.join(BUNDLE_DIR, "setup-env.cmd"),
  `@echo off
set DIR=%~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File "%DIR%setup-env.ps1" %*
`,
);

writeFile(
  path.join(BUNDLE_DIR, "setup-env.ps1"),
  fs.readFileSync(path.join(ROOT, "scripts/setup-env-windows.ps1"), "utf-8"),
);

writeFile(
  path.join(BUNDLE_DIR, "update-mcp.ps1"),
  fs.readFileSync(path.join(ROOT, "scripts/update-mcp-windows.ps1"), "utf-8"),
);

writeFile(
  path.join(BUNDLE_DIR, "README-WINDOWS.txt"),
  `NudgeEAP Design System Windows MCP Bundle

Prerequisites:
- Node.js
- pnpm

First install:
1. Extract this folder somewhere stable, for example C:\\NudgeEAPDesignSystem-Windows.
2. Run setup-env.cmd.
   - If Node.js/pnpm already exist, it only checks versions.
   - If nvm-windows exists, it installs/uses Node.js ${requiredNodeVersion}.
   - If nvm-windows is missing, it can install nvm-windows with winget.
3. Register MCP with this command path:
   C:\\NudgeEAPDesignSystem-Windows\\nudge-eap-mcp.cmd

Install DS packages into a mockup project:
1. Open a terminal in the mockup project root.
2. Run:
   C:\\NudgeEAPDesignSystem-Windows\\install-ds-packages.cmd

Next updates:
1. Close Claude/Codex.
2. Receive the latest NudgeEAPDesignSystem-Windows.zip.
3. Drag the new zip file onto update-mcp.cmd, or run:
   update-mcp.cmd C:\\path\\to\\NudgeEAPDesignSystem-Windows.zip
4. Restart Claude/Codex so the MCP process reloads.
5. If React components/tokens/icons changed, run install-ds-packages.cmd again in the mockup project.

If the mockup project still shows old styles after reinstalling the same version,
delete node_modules\\@nudge-eap in that mockup project and run install-ds-packages.cmd again.
`,
);

if (!skipInstall) {
  console.log("\nInstalling MCP runtime dependencies into Windows bundle...");
  execSync("npm install --omit=dev --ignore-scripts", { cwd: BUNDLE_DIR, stdio: "inherit" });
}

if (!skipZip) {
  removeMacMetadata(BUNDLE_DIR);
  removeIfExists(ZIP_PATH);
  try {
    execFileSync("zip", ["-qr", ZIP_PATH, BUNDLE_NAME], { cwd: OUT_ROOT, stdio: "inherit" });
  } catch {
    console.warn("zip command was not available. Bundle folder was still created.");
  }
}

console.log("\n✓ Windows MCP bundle created:");
console.log(`  ${path.relative(ROOT, BUNDLE_DIR)}`);
if (fs.existsSync(ZIP_PATH)) console.log(`  ${path.relative(ROOT, ZIP_PATH)}`);
