# 기여 가이드 (Contributing)

이 문서는 **첫 기여까지의 흐름**을 안내합니다. 실제 규칙·게이트의 **SSOT 는 [CLAUDE.md](CLAUDE.md)** 와 각 `.claude/skills/*/SKILL.md` 이며, 여기서는 그쪽으로 안내만 합니다(규칙 중복은 drift 의 원인이라 의도적으로 피합니다).

처음이라면 [ONBOARDING.md](ONBOARDING.md) → [ARCHITECTURE.md](ARCHITECTURE.md) 를 먼저 읽으세요.

---

## 무엇을 기여할 수 있나

| 유형 | 시작 지점 | 스킬 |
|---|---|---|
| 새 컴포넌트 / 컴포넌트 수정 | Figma 가이드 노드 → react/styles/html 3면 | `/ds-component` |
| 토큰 추가/수정 | `packages/tokens/src/` + `DESIGN.md` | — |
| 프로젝트 색 차이 | `packages/tokens/src/projects/<project>.ts` | — |
| 목업 피드백 → DS 반영 | 컴포넌트/토큰/가이드 트리아지 | `/ds-fix` |
| 문서/가이드 | `packages/mcp/guides-src/**` 또는 `docs/` | — |
| 정합성 감사 | drift·전파·토큰·figma sync | `/ds-audit` |

> **대부분의 작업은 스킬이 절차를 끝까지 끌고 갑니다.** 컴포넌트를 손으로 만들기 전에 `/ds-component` 를 먼저 고려하세요.

---

## 황금률 4가지

1. **추측하지 말고 조회한다** — props·토큰·아이콘은 MCP 도구(`find_component`·`find_token`·`get_guide`)로 확인. 환각이 가장 흔한 회귀 원인.
2. **프로젝트 분기를 컴포넌트에 박지 않는다** — 색·radius 차이는 `tokens/src/projects/*` 에서 토큰 값으로만. ([ARCHITECTURE.md](ARCHITECTURE.md) "프로젝트는 토큰으로만")
3. **react 를 고치면 html 도 고친다** — 3면 미러. `pnpm lint:mirror-parity` 가 차단.
4. **커밋 전 `pnpm fix`** — 생성물 재생성 누락이 CI 실패 1위.

---

## 첫 PR 플로우

```bash
# 0) 항상 main 이 아닌 브랜치(또는 워크트리)에서
git switch -c feat/my-change

# 1) 작업 (tokens 를 건드렸다면 먼저 빌드 — 컴포넌트가 import)
pnpm build --filter @nudge-design/tokens

# 2) 타입체크 / 시각 확인
npx tsc --noEmit --project apps/storybook/tsconfig.json
pnpm --filter storybook dev          # http://localhost:6006

# 3) 커밋 전 — 생성물 일괄 재생성 (필수)
pnpm fix
#   → 출력된 "재생성된 파일" 목록을 변경분과 같이 스테이징

# 4) DS 패키지 소스를 바꿨다면 changeset
pnpm changeset

git add -A && git commit   # pre-commit 게이트가 drift 를 ~1초 안에 검사
```

- **컴포넌트**라면 추가로: 스토리(`*.stories.tsx` + `tags:["gallery"]`) + `AllComponents` 카탈로그 + MCP 가이드(`figmaNodeUrl` 포함) + `componentInventory.json` 등록.
- 막히면 게이트가 정확히 무엇이 빠졌는지 알려줍니다.

---

## 커밋 게이트 (CI 안 깨지게)

CI 실패의 최다 원인은 **생성물 커밋 누락**입니다. 게이트(`check-*`)는 **검증만** 하고 재생성은 안 해줍니다.

1. **커밋 전 `pnpm fix`** — 생성물 일괄 재생성 (CI 게이트와 동일 기준).
2. pre-commit(husky) + Claude Code hook 이 `scripts/precommit-gate.mjs`(staged 기반 무빌드 선별, ~1초)를 자동 실행해 drift 차단. 비상시 `git commit --no-verify`.
3. 게이트 정의 SSOT 는 `scripts/gates.mjs`(현재 23개). 게이트 추가/변경은 거기 한 곳만.

자주 마주치는 게이트:

| 게이트 | 의미 | 해소 |
|---|---|---|
| `mirror-parity` | react↔html set/enum drift | html 미러 맞추기 or baseline 사유 |
| `project-completeness` | base 시멘틱이 5프로젝트에 정의/waiver | 프로젝트 토큰 채우기 |
| `storybook-catalog` | 신규 컴포넌트 스토리/inventory 누락 | gallery 스토리 + inventory 등록 |
| `guide-figma-links` | **신규 가이드 figmaNodeUrl 누락 차단** | frontmatter 에 노드 추가 (admission ②) |
| `input-tests` | 입력 컴포넌트 포커스 보존 테스트 | mount-once 테스트 추가 |

> 신규 컴포넌트의 `figmaNodeUrl` 은 **waiver 로 우회할 수 없습니다**(신규 가이드의 baseline 항목은 `pnpm fix` 가 자동 prune). 진짜 Figma 노드가 있어야 통과합니다 — admission 기준 ②.

---

## DS 편입 기준 (admission)

컴포넌트 1개 = 미러 3면 + 스토리 + 카탈로그 + MCP 가이드 + parity + 테스트 비용. 받기 전 체크:

1. **2+ 프로젝트 사용** 또는 프로젝트 전용이어야 할 명시 사유
2. **Figma 가이드 노드 존재**(`figmaNodeUrl`) — 디자인 근거 없는 컴포넌트는 받지 않음
3. **앱 비즈니스 로직 없음** — 데이터 fetch/도메인 규칙이 들어가면 앱 컴포넌트
4. **react + html 미러 동시 제공**(단면 제공은 baseline 에 사유 박제)

전문은 [CLAUDE.md](CLAUDE.md) "DS 편입 기준(admission)". 편입·폐기·프로젝트·품질을 아우르는 운영 규칙 전체는 [GOVERNANCE.md](GOVERNANCE.md).

---

## 외부 전파 (릴리즈)

변경이 외부 프로젝트까지 닿으려면 MCP 가이드 + MCPB 릴리즈까지 필요합니다. 전체 절차는 **`/ds-release` 스킬**이 끌고 갑니다(changeset → version → 비개발자 톤 release notes → push). 자세한 버전 SSOT/트리거는 CLAUDE.md "외부 전파" 절.

---

## 커밋 메시지

기존 이력을 따릅니다 — `type(scope): 요약` (예: `feat(ds): ...`, `fix(styles): ...`, `docs(claude): ...`, `refactor(ds)!: ...` = breaking). 한국어 요약 OK.
