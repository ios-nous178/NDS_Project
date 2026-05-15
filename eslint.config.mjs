import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const rawPaletteImportNames = [
  "colors",
  "neutral",
  "coolGray",
  "blue",
  "magenta",
  "yellow",
  "red",
  "green",
];

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.docusaurus/**",
      "**/storybook-static/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["packages/react/src/**/*.{ts,tsx}", "apps/**/*.{ts,tsx,js,jsx}"],
    ignores: [
      "packages/react/src/trost/**",
      "apps/storybook/**",
      "apps/docs/**",
      "apps/web-server/**",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@nudge-eap/tokens",
              importNames: rawPaletteImportNames,
              message:
                "Raw palette imports are blocked in app/component code. Use cv or --semantic-* tokens instead.",
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
);
