# 시작하기 (Onboarding)

이 레포를 처음 여셨나요? **30초 요약 → 내 역할 찾기 → 읽을 순서** 순으로 안내합니다.

---

## 30초 요약

- **무엇**: 5개 브랜드(Trost · Geniet · NudgeEAP · CashwalkBiz · Runmile)가 공유하는 **디자인 시스템(DS)** 모노레포 — 토큰·React 컴포넌트·아이콘·문서.
- **구조**: 10개 패키지. 핵심은 `tokens`(색/치수) → `react`/`html`(컴포넌트) → `mcp`(외부 소비자에게 가이드·규칙 강제). 자세한 그림은 [ARCHITECTURE.md](ARCHITECTURE.md).
- **특징**: 같은 정보는 한곳(SSOT)에서만 정의하고 나머지는 **생성**됩니다. 그래서 커밋 전 **`pnpm fix`** 로 생성물을 재생성하는 게 필수.
- **용어가 낯설면**: [GLOSSARY.md](GLOSSARY.md) (SSOT · 3면 미러 · semantic 토큰 · brand cascade 등).

---

## 환경 세팅 (5분)

```bash
node -v                                    # 24.x 필요
pnpm -v || npm install -g pnpm@9
pnpm install
pnpm build --filter @nudge-design/tokens   # 컴포넌트가 의존하므로 먼저
pnpm --filter storybook dev                # → http://localhost:6006
```

Windows 는 PowerShell 권장. 자세한 커맨드는 [CLAUDE.md](CLAUDE.md) "환경 세팅".

---

## 당신의 역할은? (역할별 읽을 순서)

### 🧩 A. 외부 프로덕트/목업 개발자 — "DS 를 *쓰는* 사람"
DS 소스를 고치지 않고 npm 패키지 + MCP 가이드로 소비합니다.

1. `apps/docs` 사이트의 **getting-started** + 컴포넌트 페이지
2. **MCP 서버** 연결 → `get_guide` / `find_component` / `find_token` 으로 사용법 조회 ([packages/mcp/README.md](packages/mcp/README.md))
3. 규칙은 MCP 가 발행하는 `CLAUDE.md` 가 SSOT — 추측 대신 도구로 조회

> 이 경우 **이 레포를 클론할 필요조차 없습니다.** MCP 만 연결하면 됩니다.

### 🎨 B. DS 개발자 (컴포넌트/스타일) — "DS 를 *만드는* 사람"
1. [ARCHITECTURE.md](ARCHITECTURE.md) — 3면 미러(react/styles/html)·패키지 그래프 먼저
2. [CLAUDE.md](CLAUDE.md) — DS 편입 기준(admission)·커밋 게이트·주요 커맨드 (**규칙의 SSOT**)
3. `/ds-component` 스킬 + `.claude/skills/ds-component/SKILL.md` — 컴포넌트 생성/수정 전체 절차
4. [CONTRIBUTING.md](CONTRIBUTING.md) — 첫 PR 플로우와 게이트

### 🎛️ C. DS 개발자 (토큰/브랜드)
1. [DESIGN.md](DESIGN.md) — 토큰 YAML 정의
2. `packages/tokens/src/` + [packages/tokens/README.md](packages/tokens/README.md)
3. `docs/guide/design-token-principles.mdx` + `token-review-checklist.mdx`
4. 브랜드 색은 `packages/tokens/src/brands/<brand>.ts` 에서만 (컴포넌트 X) — [ARCHITECTURE.md](ARCHITECTURE.md) "브랜드는 토큰으로만"

### 🖼️ D. 디자이너 / 기획 (Figma 연결)
1. `docs/FIGMA_TO_REACT_WORKFLOW.md` — Figma → React 워크플로우 철학
2. `docs/COMPONENT_DOC_TEMPLATE.md` — 컴포넌트 문서 스키마
3. 컴포넌트 가이드의 `figmaNodeUrl` 이 디자인 ↔ 코드 연결점 ([GLOSSARY.md](GLOSSARY.md))

---

## 자주 묻는 질문

**Q. 왜 모노레포인가?**
토큰 → 컴포넌트 → 문서 → MCP 가 한 버전으로 묶여 움직여야 drift 가 안 생깁니다. turbo 가 의존 순서대로 빌드합니다.

**Q. 왜 5개 브랜드인가?**
EAP 멘탈케어 플랫폼이 브랜드별로 운영되기 때문입니다. 브랜드 차이는 **토큰 값 override** 로만 표현하고 컴포넌트는 브랜드를 모릅니다. ([ARCHITECTURE.md](ARCHITECTURE.md))

**Q. `pnpm fix` 가 뭔가요?**
소스를 고친 뒤 파생 생성물(catalog.json·guides.generated.ts·metadata 등)을 올바른 순서로 일괄 재생성하는 명령입니다. **커밋 전 필수.** ([CONTRIBUTING.md](CONTRIBUTING.md))

**Q. react 만 쓰면 되나, icons/tokens 도 깔아야 하나?**
`@nudge-design/react` 가 tokens·icons·styles·assets 를 의존하므로 함께 설치됩니다. 토큰만 따로 쓰거나 Tailwind 를 쓰면 `tokens`/`tailwind-preset` 만 골라 쓸 수 있습니다. ([각 패키지 README](packages/) 참고)

**Q. 빌드가 깨져요.**
대개 `pnpm build --filter @nudge-design/tokens` 를 먼저 안 돌렸거나(컴포넌트가 토큰 dist 를 import), Node 버전이 24.x 가 아니거나, 생성물을 재생성 안 한 경우입니다.

---

## 다음 문서

- [ARCHITECTURE.md](ARCHITECTURE.md) — 패키지 구조·3면 미러·생성물
- [GLOSSARY.md](GLOSSARY.md) — 용어집
- [CONTRIBUTING.md](CONTRIBUTING.md) — 첫 기여 플로우
- [CLAUDE.md](CLAUDE.md) — 규칙·게이트의 SSOT (AI 에이전트 지침이지만 사람도 읽을 가치 있음)
