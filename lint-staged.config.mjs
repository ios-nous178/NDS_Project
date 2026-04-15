export default {
  "*.{js,mjs,cjs,ts,tsx,jsx}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"],
  "*.md": ["markdownlint-cli2 --fix"],
};
