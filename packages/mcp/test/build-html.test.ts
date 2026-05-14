import { describe, it, expect } from "vitest";
import { patchViteConfig } from "../src/tools/build-html.js";

describe("patchViteConfig", () => {
  it("inserts import + viteSingleFile() into a typical vite.config", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toContain(`import { viteSingleFile } from "vite-plugin-singlefile";`);
    expect(out).toMatch(/plugins:\s*\[react\(\), viteSingleFile\(\)\]/);
  });

  it("handles plugins array with trailing comma", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
  ],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    // trailing comma should not produce double-comma
    expect(out).not.toMatch(/,\s*,/);
    expect(out).toMatch(/viteSingleFile\(\)/);
  });

  it("handles empty plugins array", () => {
    const input = `import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toMatch(/plugins:\s*\[viteSingleFile\(\)\]/);
  });

  it("handles nested brackets inside plugins array", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ babel: { plugins: ["a", "b"] } })],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    // make sure we didn't break the nested array — viteSingleFile() should be
    // inside the outer plugins array, not the nested babel.plugins one
    expect(out).toMatch(
      /babel:\s*\{\s*plugins:\s*\["a",\s*"b"\]\s*\}\s*\}\),\s*viteSingleFile\(\)\]/,
    );
  });

  it("ignores brackets inside strings", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: "src/**/*.{[tj]sx,[tj]s}" })],
});
`;
    const out = patchViteConfig(input);
    expect(out).not.toBeNull();
    expect(out).toContain(`viteSingleFile()`);
  });

  it("returns null when plugins array is not a literal", () => {
    const input = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const myPlugins = [react()];

export default defineConfig({
  plugins: myPlugins,
});
`;
    const out = patchViteConfig(input);
    expect(out).toBeNull();
  });

  it("returns null when there are no import lines", () => {
    const input = `export default { plugins: [] };\n`;
    const out = patchViteConfig(input);
    expect(out).toBeNull();
  });
});
