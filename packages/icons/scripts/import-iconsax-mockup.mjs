import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, readFileSync, readdirSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const PACKAGE_NAME = "iconsax-react";
const PACKAGE_VERSION = "0.0.8";
const EXCLUDED_CATEGORIES = new Set(["Crypto, Company"]);

const rootDir = path.resolve(import.meta.dirname, "..");
const svgDir = path.join(rootDir, "svg");
const srcDir = path.join(rootDir, "src");
const tempDir = mkdtempSync(path.join(tmpdir(), "nudge-iconsax-"));

function toKebabCase(componentName) {
  const slug = componentName
    .replace(/^I(?=\d)/, "")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return /^\d/.test(slug) ? `icon${slug}` : slug;
}

function normalizeSvg(svg) {
  return svg.replace(/\sdata-reactroot=""/g, "") + "\n";
}

function cleanExistingMockupSvgs() {
  for (const fileName of readdirSync(svgDir)) {
    if (fileName.startsWith("mockup-") && fileName.endsWith(".svg")) {
      unlinkSync(path.join(svgDir, fileName));
    }
  }

  for (const fileName of readdirSync(srcDir)) {
    if (/^Mockup.*Icon\.tsx$/.test(fileName)) {
      unlinkSync(path.join(srcDir, fileName));
    }
  }
}

function packIconsax() {
  execFileSync(
    "npm",
    ["pack", `${PACKAGE_NAME}@${PACKAGE_VERSION}`, "--silent", "--pack-destination", tempDir],
    {
      stdio: "inherit",
    },
  );
  execFileSync(
    "npm",
    ["install", "--silent", "--prefix", tempDir, "react@18", "react-dom@18", "prop-types"],
    {
      stdio: "inherit",
    },
  );

  const tarball = path.join(tempDir, `${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz`);
  execFileSync("tar", ["-xzf", tarball, "-C", tempDir], { stdio: "inherit" });

  return path.join(tempDir, "package");
}

function getIconNames(packageDir) {
  const metadata = JSON.parse(
    readFileSync(path.join(packageDir, "dist", "meta-data.json"), "utf8"),
  );
  const names = new Set();

  for (const category of metadata.categories) {
    if (EXCLUDED_CATEGORIES.has(category.name)) continue;
    for (const icon of category.icons) names.add(icon);
  }

  return [...names].sort((a, b) => toKebabCase(a).localeCompare(toKebabCase(b)));
}

function main() {
  try {
    const packageDir = packIconsax();
    const require = createRequire(path.join(packageDir, "dist", "cjs", "index.js"));
    const React = require("react");
    const { renderToStaticMarkup } = require("react-dom/server");

    cleanExistingMockupSvgs();

    const iconNames = getIconNames(packageDir);
    let written = 0;

    for (const iconName of iconNames) {
      const Icon = require(path.join(packageDir, "dist", "cjs", `${iconName}.js`));
      const baseName = toKebabCase(iconName);

      for (const variant of ["Linear", "Bold"]) {
        const svg = renderToStaticMarkup(
          React.createElement(Icon, {
            variant,
            color: "currentColor",
            size: 24,
          }),
        );
        const variantName = variant.toLowerCase();
        const fileName = `mockup-${variantName}-${baseName}.svg`;

        writeFileSync(path.join(svgDir, fileName), normalizeSvg(svg));
        written += 1;
      }
    }

    console.log(`Imported ${written} mockup icons from ${PACKAGE_NAME}@${PACKAGE_VERSION}.`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main();
