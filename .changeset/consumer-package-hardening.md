---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/icons": patch
---

외부 프로젝트(npm 소비) 정합 패치 — 3건:

- **tokens**: 확장자 없는 `./css*` 서브패스에 `types` 조건 + `dist/css-stub.d.ts` 추가. TypeScript 6(새 Vite react-ts 템플릿 기본)에서 `import "@nudge-design/tokens/css"` 가 TS2882 로 깨지던 문제 해결.
- **tokens/icons/react**: `sideEffects` 선언 추가 (tokens·icons `false`, react `["**/*.css"]`). 트리셰이킹이 살아나 소형 목업 기준 JS 번들 2,605 KB → 245 KB (gzip 625 → 75 KB).
- **react**: `files: ["dist"]` 추가 — tarball 에 실리던 `src/`·`test/`·`.turbo/` 제거 (825 KB → 513 KB).
