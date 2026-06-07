#!/usr/bin/env node
/**
 * Storybook component catalog gate.
 *
 * Ensures the component stories exposed in apps/storybook are represented in
 * metadata/componentInventory.json so AllComponents / docs gallery do not drift.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STORY_DIR = path.join(ROOT, "apps", "storybook", "src", "stories");
const INVENTORY_PATH = path.join(ROOT, "metadata", "componentInventory.json");

function extractStoryTitle(source) {
  const match = source.match(/const\s+meta[\s\S]*?title:\s*["'`]([^"'`]+)["'`]/m);
  return match?.[1] ?? null;
}

function loadStoryTitles() {
  const entries = new Map();
  const files = readdirSync(STORY_DIR);

  for (const file of files) {
    if (!/\.stories\.[tj]sx?$/.test(file)) continue;
    const source = readFileSync(path.join(STORY_DIR, file), "utf8");
    const title = extractStoryTitle(source);
    if (!title || !title.startsWith("Components/")) continue;
    entries.set(title, file);
  }

  return entries;
}

const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf8"));
const inventoryTitles = new Set(inventory.map((entry) => entry.storybookTitle));
const storyTitles = loadStoryTitles();

const missing = [...storyTitles.entries()]
  .filter(([title]) => !inventoryTitles.has(title))
  .map(([title, file]) => ({ title, file }))
  .sort((a, b) => a.title.localeCompare(b.title));

if (missing.length > 0) {
  console.error("[check:storybook-catalog] component stories missing from inventory:");
  for (const item of missing) {
    console.error(`- ${item.title} (${item.file})`);
  }
  process.exit(1);
}

console.log(
  `[check:storybook-catalog] all component stories are covered (${storyTitles.size} titles).`,
);
