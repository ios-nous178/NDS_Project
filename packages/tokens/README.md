# @nudge-design/tokens

Nudge Design System 의 **디자인 토큰** — 색·타이포·spacing·radius·elevation·motion. TS export 와 CSS 변수를 함께 생성하며, 5개 프로젝트의 값 override 가 여기서 흘러나갑니다.

## 위치

의존 그래프의 **기반(base)** — 아무것도 import 하지 않고, `react`·`html`·`styles`·`tailwind-preset` 이 모두 이걸 의존합니다. 그래서 **가장 먼저 빌드**돼야 합니다:

```bash
pnpm build --filter @nudge-design/tokens   # 컴포넌트 작업 전 필수
```

## 무엇을 담나

- `src/{colors,typography,spacing,elevation,motion,radius,sizing}.ts` — 원시 + 시멘틱 토큰
- `src/cssVar.ts` — `cv.*` 헬퍼 (컴포넌트가 `var(--semantic-*)` 를 타입 안전하게 참조)
- `src/projects/<project>.ts` — **프로젝트별 토큰 override** (값만 덮어씀, 5프로젝트)

## 토큰 두 갈래

- `--semantic-*` — Figma 정합 시멘틱 (색 bg/text/icon/fill/border/button*/input + 여백 gap/inset)
- `--nds-*` — DS 컴포넌트 전용 슬롯 (variant × project 합성 지점)

raw hex 신규 추가는 금지(게이트 차단). 옛 prefix `--eap-*`·`--color-semantic-*` 는 폐기.

## 토큰 추가/수정 절차

1. `src/*.ts` 수정 → `DESIGN.md` YAML 에도 의도 동기화
2. `pnpm build --filter @nudge-design/tokens`
3. `pnpm lint:project-completeness` — base 시멘틱 leaf 는 5프로젝트 명시 정의 or waiver

자세한 규칙: [CLAUDE.md](../../CLAUDE.md) "신규/수정 토큰", `docs/guide/design-token-principles.mdx`. 구조: [ARCHITECTURE.md](../../ARCHITECTURE.md).
