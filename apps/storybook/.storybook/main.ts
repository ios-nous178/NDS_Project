import type { StorybookConfig } from "@storybook/react-vite";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const storybookDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(storybookDir, "..");
const workspaceRoot = resolve(appDir, "../..");

// preview.ts / project-themes.ts 가 dist CSS 를 import 한다 — 없으면 스토리북이
// 스타일 없이(또는 stale 하게) 뜨므로 기동 자체를 막고 빌드 방법을 안내한다.
// (pnpm --filter storybook dev 는 dev-storybook.mjs 가 사전 빌드를 보장한다)
const requiredDistCss = ["packages/tokens/dist/tokens.css", "packages/react/dist/styles.css"];
const missingDist = requiredDistCss.filter((rel) => !existsSync(resolve(workspaceRoot, rel)));
if (missingDist.length > 0) {
  throw new Error(
    `[storybook] 빌드된 CSS 가 없습니다: ${missingDist.join(", ")}\n` +
      `  → 루트에서 "pnpm build --filter @nudge-design/react..." 를 먼저 실행하거나\n` +
      `  → "pnpm --filter storybook dev" (자동 사전 빌드 포함) 로 기동하세요.`,
  );
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
  ],
  staticDirs: [
    "../public",
    // binary assets 는 @nudge-design/assets 가 SSOT. Storybook 은 새 S3 mirror taxonomy 와
    // 같은 /assets/* URL 로 src/files 전체를 직접 마운트한다.
    {
      from: "../../../packages/assets/src/files",
      to: "/assets",
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules\/(?!@nudge-eap)/.test(prop.parent.fileName) : true,
    },
  },
  async viteFinal(config) {
    const isBuild = process.env.NODE_ENV === "production";
    return {
      ...config,
      base: isBuild ? "/storybook/" : config.base,
      cacheDir: resolve(appDir, "node_modules/.cache/storybook/sb-vite"),
      resolve: {
        ...config.resolve,
        dedupe: [...(config.resolve?.dedupe ?? []), "react", "react-dom"],
      },
      server: {
        ...config.server,
        fs: {
          ...config.server?.fs,
          allow: [...(config.server?.fs?.allow ?? []), workspaceRoot],
        },
      },
    };
  },
  build: {
    test: {
      disabledAddons: [],
    },
  },
};

export default config;
