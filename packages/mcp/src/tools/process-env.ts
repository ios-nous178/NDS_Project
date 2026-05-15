import fs from "node:fs";
import path from "node:path";

const COMMON_BIN_DIRS = [
  "/opt/homebrew/bin",
  "/opt/homebrew/sbin",
  "/usr/local/bin",
  "/usr/local/sbin",
  "/usr/bin",
  "/bin",
  "/usr/sbin",
  "/sbin",
];

function getHomeBinDirs(): string[] {
  const home = process.env.HOME;
  if (!home) return [];

  const dirs = [
    path.join(home, ".volta/bin"),
    path.join(home, ".asdf/shims"),
    path.join(home, ".nodenv/shims"),
  ];

  const nvmVersionsDir = path.join(home, ".nvm/versions/node");
  try {
    for (const versionDir of fs.readdirSync(nvmVersionsDir)) {
      dirs.push(path.join(nvmVersionsDir, versionDir, "bin"));
    }
  } catch {
    // nvm is optional.
  }

  return dirs.filter((dir) => fs.existsSync(dir));
}

function splitPath(value: string | undefined): string[] {
  return (value ?? "").split(path.delimiter).filter(Boolean);
}

function dedupe(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

export function getAugmentedPath(): string {
  const nodeBinDir = path.dirname(process.execPath);
  return dedupe([
    nodeBinDir,
    ...COMMON_BIN_DIRS,
    ...getHomeBinDirs(),
    ...splitPath(process.env.PATH),
  ]).join(path.delimiter);
}

export function getToolProcessEnv(extra: NodeJS.ProcessEnv = {}): NodeJS.ProcessEnv {
  return {
    ...process.env,
    ...extra,
    PATH: getAugmentedPath(),
  };
}
