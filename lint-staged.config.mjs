// 자동 생성 산출물은 lint/prettier 대상에서 제외 — source는 .svg
const isGenerated = (f) => f.includes("packages/icons/src/");

export default {
  "*.{js,mjs,cjs,ts,tsx,jsx}": (files) => {
    const filtered = files.filter((f) => !isGenerated(f));
    if (filtered.length === 0) return [];
    const arg = filtered.map((f) => `'${f}'`).join(" ");
    return [`eslint --fix ${arg}`, `prettier --write ${arg}`];
  },
  "*.{json,md,css}": ["prettier --write"],
};
