---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/icons": patch
"@nudge-design/assets": patch
"@nudge-design/html": patch
"@nudge-design/tailwind-preset": patch
---

패키지를 Node-로더블 ESM 으로 전환 (번들러 없이도 동작):

- 전 패키지 `"type": "module"` + tsc `module: NodeNext` 전환, 소스 상대 임포트에 `.js` 확장자 명시 (NodeNext 가 컴파일 타임에 강제).
- exports 맵에 `default` 조건 추가 — Node ≥22 `require(esm)` 으로 CJS 소비도 동작.
- 효과: Next.js SSR/RSC 를 `transpilePackages` 없이 사용 가능, Node 스크립트·tsx·vitest(외부화 모드)에서 직접 import 가능. Vite 목업 플로우는 동작·번들 크기 변화 없음 (실측 245 KB 유지).
- icons 생성기(`scripts/generate.cjs`)가 barrels 에 `.js` specifier 를 emit 하도록 갱신. dist 는 per-file 산출 유지 — catalog/brand-completeness/MCPB 패킹 등 dist 레이아웃 의존 툴링 영향 없음.
