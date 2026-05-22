import type { StorybookConfig } from "@storybook/react-vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const storybookDir = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(storybookDir, "..");
const workspaceRoot = resolve(appDir, "../..");

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
  ],
  staticDirs: ["../public"],
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
      optimizeDeps: {
        ...config.optimizeDeps,
        force: true,
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
