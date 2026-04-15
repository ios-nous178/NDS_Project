# QA 자동화 및 Figma/Web 동기화 프로세스 기획 v1

> NudgeEAP Design System의 품질 보증(QA)을 자동화하고, Figma↔Code 사이의 동기화를 체계적으로 관리하기 위한 기획 문서입니다.

---

## 1. 현재 상태 진단

### 이미 갖춰진 것

| 영역             | 도구                                         | 상태                                                  |
| ---------------- | -------------------------------------------- | ----------------------------------------------------- |
| 린트/포맷        | ESLint, Prettier, markdownlint               | CI + pre-commit 적용                                  |
| 타입 체크        | TypeScript `tsc --noEmit`                    | CI + pre-push 적용                                    |
| 빌드 검증        | Turbo 기반 CI (lint → typecheck → build)     | GitHub Actions 동작 중                                |
| 시각 회귀        | Chromatic (Storybook 연동)                   | 워크플로우 존재, 토큰 없으면 skip                     |
| 접근성           | Storybook a11y addon 설치됨                  | `test: "error"`로 Storybook test-runner에서 실패 처리 |
| Figma 메타데이터 | componentInventory.json + 자동 생성 스크립트 | 수동 입력 → 문서 생성                                 |
| PR 템플릿        | Figma 링크, 토큰 변경 여부 체크리스트        | 존재하지만 강제 아님                                  |

### 비어 있는 것

| 영역                 | 현재 상태                                      |
| -------------------- | ---------------------------------------------- |
| 컴포넌트 단위 테스트 | Jest/Vitest 미설정                             |
| 인터랙션 테스트      | 주요 컴포넌트에 `play` 기반 시나리오 일부 존재 |
| E2E / 통합 테스트    | 없음                                           |
| 접근성 자동 테스트   | Storybook test-runner + a11y로 CI에서 실행 중  |
| 시각 회귀 자동화     | Chromatic 토큰 미설정, PR 필수 아님            |
| 토큰 드리프트 감지   | 없음 — 토큰 변경 시 컴포넌트 영향 파악 불가    |
| Figma 자동 추출      | 없음 — 수동으로 값 확인 후 코드에 반영         |
| PR 검증 봇           | 없음 — 체크리스트가 강제되지 않음              |

---

## 2. 목표

### 핵심 원칙

1. **사람의 기억에 의존하지 않는다** — 토큰 변경, Figma 불일치, 접근성 위반은 자동으로 감지한다
2. **점진적으로 도입한다** — 한 번에 모든 것을 자동화하지 않고, 가치가 높은 것부터 단계적으로 적용한다
3. **개발 속도를 떨어뜨리지 않는다** — 자동화가 병목이 되면 안 된다. 빠른 피드백 루프를 유지한다
4. **AI는 도구다** — AI가 판단을 대체하지 않고, 반복 작업을 줄이고 초안을 생성하는 데 활용한다
5. **구조와 구현을 분리해서 본다** — 시각 QA가 통과해도 web-only dependency가 core contract에 섞였는지는 별도로 리뷰한다

### 달성하고 싶은 상태

```
PR 올리면 →
  ✅ 린트, 타입체크, 빌드 (이미 있음)
  ✅ 컴포넌트 단위 테스트 통과
  ✅ 시각 회귀 스냅샷 비교 (변경분 리뷰 가능)
  ✅ 접근성 위반 자동 감지
  ✅ 토큰 변경 시 영향 범위 자동 표시
  ✅ Figma 메타데이터 누락 경고

Figma에서 디자인 변경되면 →
  ✅ 토큰/스펙 변경사항 자동 감지
  ✅ 코드와의 차이점 리포트 생성
  ✅ 필요 시 PR 자동 생성 또는 이슈 등록
```

---

## 3. 단계별 로드맵

### 구조 리뷰 원칙

QA 자동화는 주로 "보이는 회귀"와 "사용 계약"을 잡는다. 하지만 크로스플랫폼 대응 가능성을 열어두려면, 아래 항목은 별도로 구조 리뷰해야 한다.

- `document`, `window`, `createPortal`, DOM measurement, scroll lock 같은 web-only dependency가 core contract에 섞여 있는지
- 상태 계산과 renderer-specific behavior가 분리되어 있는지
- 포털 컨테이너나 측정 전략이 교체 가능한지

대표적으로 `Tabs`, `Select`, `Toast`는 Storybook과 Chromatic만으로 충분하지 않다. visual QA는 유지하되, 구조 리뷰에서는 core contract와 web layer가 나뉘어 있는지도 함께 확인한다.

### Phase 1 — 기반 구축 (1~2주)

> 테스트 인프라를 설치하고, 가장 투자 대비 효과가 큰 자동화부터 적용한다.

#### 1-1. Vitest 도입 + 컴포넌트 단위 테스트

**왜**: 컴포넌트의 Props 조합, 상태 변화, 이벤트 핸들링이 의도대로 동작하는지 보장한다. 리팩토링 시 안전망이 된다.

#### 설치

```bash
pnpm add -Dw vitest @testing-library/react @testing-library/jest-dom jsdom
```

**설정** — `packages/react/vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
});
```

#### 우선 작성할 테스트 (MVP)

| 컴포넌트 | 테스트 항목                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| Button   | variant/size/color 렌더링, disabled 클릭 방지, fullWidth, 아이콘 슬롯, ref 전달 |
| Badge    | variant별 색상, size별 크기                                                     |
| Input    | label-input 연결, error 상태, clearable 동작, controlled/uncontrolled           |
| Modal    | open/close, ESC 닫기, 포커스 트랩, 오버레이 클릭 닫기, body 스크롤 잠금         |
| Popup    | open/close, confirm/cancel 콜백, alertdialog role                               |

#### 테스트 파일 구조

```
packages/react/
├── src/
│   ├── Button.tsx
│   └── ...
└── test/
    ├── setup.ts          # @testing-library/jest-dom import
    ├── Button.test.tsx
    ├── Badge.test.tsx
    ├── Input.test.tsx
    ├── Modal.test.tsx
    └── Popup.test.tsx
```

**CI 추가** — `turbo.json`에 `test` 태스크 추가

```json
{
  "tasks": {
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "test/**"],
      "outputs": []
    }
  }
}
```

#### 1-2. Storybook 접근성 테스트 CI 자동화

**왜**: a11y addon이 이미 설치되어 있지만, 사람이 스토리북을 열어서 확인해야 한다. CI에서 자동으로 돌려야 의미가 있다.

**방법**: `@storybook/test-runner` + `axe-playwright`

```bash
pnpm --filter @nudge-eap/storybook add -D @storybook/test-runner axe-playwright
```

**테스트 러너 설정** — `apps/storybook/.storybook/test-runner.ts`

```ts
import { getStoryContext } from "@storybook/test-runner";
import { injectAxe, checkA11y } from "axe-playwright";

export default {
  async preVisit(page) {
    await injectAxe(page);
  },
  async postVisit(page, context) {
    const storyContext = await getStoryContext(page, context);

    // a11y 비활성화 태그가 없는 스토리만 검사
    if (!storyContext.tags?.includes("no-a11y")) {
      await checkA11y(page, "#storybook-root", {
        detailedReport: true,
        detailedReportOptions: { html: true },
      });
    }
  },
};
```

#### CI 워크플로우 추가

```yaml
# .github/workflows/ci.yml 에 step 추가
- name: Accessibility test
  run: |
    pnpm storybook build
    npx concurrently -k -s first \
      "npx http-server apps/storybook/storybook-static -p 6006 --silent" \
      "npx wait-on tcp:6006 && pnpm --filter @nudge-eap/storybook test-storybook"
```

#### 1-3. Chromatic 활성화

**왜**: PR마다 시각 회귀를 자동으로 감지하고, 변경된 컴포넌트의 before/after 스냅샷을 리뷰할 수 있다.

#### 필요 작업

1. Chromatic 프로젝트 생성 → 토큰 발급
2. GitHub Secrets에 `CHROMATIC_PROJECT_TOKEN` 등록
3. 기존 `.github/workflows/chromatic.yml` 활성화
4. PR에 Chromatic 체크를 required로 설정

**효과**: 토큰 색상 변경, 패딩 변경, 폰트 변경 등이 의도치 않게 다른 컴포넌트에 영향을 주면 즉시 포착된다.

---

### Phase 2 — 토큰 & Figma 동기화 (2~3주)

> Figma 디자인과 코드 사이의 괴리를 자동으로 감지하고, 토큰 변경의 영향 범위를 파악한다.

#### 2-1. 토큰 영향 분석 스크립트

**왜**: `colors.blue[500]`을 변경하면 어떤 컴포넌트가 영향을 받는지 수동으로 파악해야 한다. 이걸 자동화한다.

**구현**: `scripts/token-impact.mjs`

```
사용법:
  pnpm token:impact blue.500
  pnpm token:impact spacing.16
  pnpm token:impact semantic.primary.main

출력:
  Token: colors.blue[500] (#2B96ED)
  ─────────────────────────────
  Affected components:
    ✦ Button.tsx:97     — solid enabled background
    ✦ Button.tsx:113    — outlined enabled text
    ✦ Input.tsx:50      — focused border color
    ✦ Modal.tsx:145     — confirm button text
  ─────────────────────────────
  Total: 4 components, 4 references
```

#### 동작 원리

1. `packages/tokens/src/*.ts`에서 토큰 이름 → 값 매핑 로드
2. `packages/react/src/*.tsx`에서 해당 토큰을 참조하는 라인 검색
3. 결과를 테이블로 출력

**CI 연동**: PR에서 토큰 파일이 변경되었으면 자동으로 영향 분석 결과를 PR 코멘트로 남긴다.

```yaml
- name: Token impact analysis
  if: contains(steps.changed-files.outputs.all, 'packages/tokens/')
  run: node scripts/token-impact.mjs --changed --format=markdown >> $GITHUB_STEP_SUMMARY
```

#### 2-2. Figma 디자인 토큰 추출 자동화

**왜**: 현재는 Figma에서 값을 눈으로 확인하고 수동으로 `tokens/src/colors.ts`에 입력한다. Figma API를 통해 자동 추출하면 누락과 오타를 방지할 수 있다.

#### 방법 A — Figma Variables API 활용 (권장)

Figma의 Variables(변수) 기능을 사용 중이라면:

```
scripts/figma-sync.mjs

1. Figma API로 Variables 조회
   GET /v1/files/:fileKey/variables/local
2. 변수 이름 → 토큰 이름 매핑
   "Color/Blue/500" → colors.blue[500]
3. 현재 tokens/*.ts 값과 비교
4. 차이가 있으면 리포트 출력

출력 예시:
  ⚠ Drift detected:
    colors.blue[500]  Code: #2B96ED  Figma: #2A95EC  (ΔE: 0.3)
    spacing[20]       Code: 20px     Figma: 24px
```

#### 방법 B — Figma MCP 서버 활용 (AI 보조)

이미 프로젝트에 Figma MCP 서버가 연결되어 있으므로:

```
Claude Code에서:
  "Figma의 Button 컴포넌트(508:6962)를 확인해서
   현재 tokens/colors.ts의 값과 비교해줘"

→ get_design_context로 Figma 값 추출
→ 로컬 토큰 파일과 diff
→ 불일치 리포트 생성
```

이 방식은 스크립트 없이 즉시 사용 가능하고, 정기적으로 실행할 수도 있다.

#### 방법 C — 수동 + 체크리스트 강화 (최소 투자)

자동화 없이 프로세스만 강화:

```
PR 체크리스트에 추가:
  □ Figma 변수와 tokens/*.ts 값이 일치하는지 확인했습니까?
  □ 변경된 토큰이 있다면 token:impact 결과를 확인했습니까?

GitHub Action으로 체크리스트 미체크 시 merge 차단
```

**권장 순서**: C(즉시) → B(1주) → A(2~3주)

#### 2-3. Figma 컴포넌트 스펙 자동 비교

**왜**: Figma에서 Button 패딩을 16→20으로 변경했는데, 코드를 깜빡하고 안 고치면 Figma↔Code 드리프트가 발생한다.

**구현**: 주기적으로 또는 PR 시점에 Figma 노드의 레이아웃 값과 코드의 하드코딩 값을 비교

#### 비교 대상

```json
{
  "Button": {
    "figmaNodeId": "508:6962",
    "checks": [
      { "property": "paddingLeft", "codeRef": "sizeConfig.lg.px", "codeFile": "Button.tsx" },
      { "property": "paddingTop", "codeRef": "sizeConfig.lg.py", "codeFile": "Button.tsx" },
      { "property": "height", "codeRef": "sizeConfig.lg.height", "codeFile": "Button.tsx" },
      { "property": "cornerRadius", "codeRef": "radius.md", "codeFile": "spacing.ts" }
    ]
  }
}
```

#### 스크립트 흐름

```
1. metadata/figma-spec-checks.json 읽기
2. Figma API로 각 노드의 실측값 조회
3. 코드 파일에서 대응 값 추출
4. 비교 → 차이가 있으면 경고

출력:
  ✅ Button.lg.height    Code: 48px   Figma: 48px
  ⚠️ Button.lg.paddingX  Code: 16px   Figma: 20px  ← 드리프트!
  ✅ Button.lg.paddingY   Code: 12px   Figma: 12px
```

---

### Phase 3 — 고급 자동화 (3~4주)

> Phase 1~2가 안정화된 후, AI를 활용한 고급 자동화를 도입한다.

#### 3-1. Storybook Interaction 테스트

**왜**: 컴포넌트의 인터랙션 시나리오(클릭, 타이핑, 포커스 이동)를 자동으로 검증한다.

**예시** — `Modal.stories.tsx`에 play function 추가

```tsx
import { within, userEvent, expect } from "@storybook/test";

export const ConfirmFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // 모달 열기
    await userEvent.click(canvas.getByRole("button", { name: "열기" }));

    // 모달 표시 확인
    const dialog = within(document.body).getByRole("dialog");
    expect(dialog).toBeVisible();

    // 확인 버튼 클릭
    await userEvent.click(within(dialog).getByText("확인"));

    // 모달 닫힘 확인
    expect(within(document.body).queryByRole("dialog")).toBeNull();
  },
};
```

#### 우선 작성 대상

| 컴포넌트 | 시나리오                                              |
| -------- | ----------------------------------------------------- |
| Modal    | 열기 → 확인/취소 → 닫기, ESC 닫기, 오버레이 클릭 닫기 |
| Popup    | 확인 → 콜백 호출, 취소 → 콜백 호출                    |
| Input    | 타이핑 → 클리어 → 포커스 복귀, 에러 상태 전환         |
| Button   | 클릭 이벤트 호출, disabled 시 클릭 무시               |

#### 3-2. AI 기반 컴포넌트 QA 리뷰

**왜**: 새 컴포넌트나 변경된 컴포넌트를 AI가 자동으로 리뷰하여, 놓치기 쉬운 문제를 잡아준다.

#### 방법 1 — Claude Code Hook (로컬)

```jsonc
// .claude/settings.json
{
  "hooks": {
    "PreCommit": [
      {
        "matcher": "packages/react/src/*.tsx",
        "command": "node scripts/ai-qa-check.mjs $FILE",
      },
    ],
  },
}
```

`ai-qa-check.mjs`가 확인하는 것:

```
□ CSS 변수 네이밍이 --nds-{component}-{property} 패턴을 따르는가
□ data-slot 속성이 모든 내부 요소에 있는가
□ forwardRef를 지원하는가
□ aria-* 속성이 적절한가
□ slotProps 패턴을 지원하는가
□ 하드코딩된 색상값이 있는가 (토큰 미사용)
```

#### 방법 2 — GitHub Action + Claude API (CI)

```yaml
- name: AI Component Review
  if: contains(steps.changed-files.outputs.all, 'packages/react/src/')
  run: |
    node scripts/ai-review.mjs \
      --files "${{ steps.changed-files.outputs.all }}" \
      --checklist .claude/component-qa-checklist.md \
      --output pr-comment
```

PR 코멘트로 자동 리뷰 결과 표시:

```markdown
## 🤖 AI Component QA Review

### Button.tsx (변경됨)

| 항목            | 결과       | 비고                         |
| --------------- | ---------- | ---------------------------- |
| CSS 변수 네이밍 | ✅ Pass    |                              |
| data-slot 속성  | ✅ Pass    |                              |
| forwardRef      | ✅ Pass    |                              |
| 접근성          | ⚠️ Warning | aria-label이 leftIcon에 없음 |
| 하드코딩 색상   | ✅ Pass    |                              |
| slotProps       | ✅ Pass    |                              |
```

#### 3-3. Figma 변경 감지 → 자동 이슈 생성

**왜**: Figma에서 디자이너가 변경한 내용을 개발자가 모르고 지나가는 것을 방지한다.

**방법**: Figma Webhook + GitHub Actions

```
Figma Webhook (FILE_UPDATE) 수신
  → scripts/figma-change-detect.mjs 실행
  → 변경된 노드 ID를 componentInventory.json과 매칭
  → 매칭된 컴포넌트가 있으면 GitHub Issue 자동 생성

Issue 예시:
  Title: [Figma 변경 감지] Button 컴포넌트 디자인 업데이트
  Body:
    - 변경된 노드: 508:6962
    - 변경 시각: 2026-04-12 14:30 KST
    - Figma 링크: https://figma.com/...
    - 영향 받는 코드: packages/react/src/Button.tsx
    - 액션: 토큰/코드 변경 필요 여부를 확인해주세요
```

**대안 (Webhook 없이)**: Cron 기반 정기 비교

```yaml
# .github/workflows/figma-drift-check.yml
on:
  schedule:
    - cron: "0 9 * * 1" # 매주 월요일 오전 9시

jobs:
  drift-check:
    runs-on: ubuntu-latest
    steps:
      - run: node scripts/figma-drift-check.mjs --report=github-issue
```

#### 3-4. 컴포넌트 스크린샷 스냅샷 (Figma vs Web)

**왜**: Figma 디자인과 실제 웹 렌더링을 시각적으로 나란히 비교한다.

#### 방법

```
1. Figma API로 컴포넌트 노드의 이미지 export (PNG)
2. Storybook 스토리를 Playwright로 캡처 (PNG)
3. pixelmatch 등으로 시각적 차이 계산
4. 차이가 임계값 초과 시 경고 + diff 이미지 생성
```

#### 출력 예시

```
┌──────────────────────────────────────────┐
│  Button (Solid / Primary / LG)           │
├──────────┬──────────┬────────────────────┤
│  Figma   │   Web    │   Diff (2.1%)      │
│  [image] │  [image] │   [highlighted]    │
├──────────┴──────────┴────────────────────┤
│  ✅ 임계값(5%) 이내 — Pass               │
└──────────────────────────────────────────┘
```

---

## 4. 도구 선택 가이드

### 테스트 프레임워크

| 도구                       | 용도                         | 도입 시점         |
| -------------------------- | ---------------------------- | ----------------- |
| **Vitest**                 | 컴포넌트 단위 테스트         | Phase 1           |
| **@testing-library/react** | DOM 기반 테스트 유틸리티     | Phase 1           |
| **Storybook test-runner**  | 스토리 자동 실행 + a11y 검증 | Phase 1           |
| **axe-playwright**         | 접근성 자동 테스트           | Phase 1           |
| **Chromatic**              | 시각 회귀 테스트             | Phase 1           |
| **Playwright**             | E2E, 스크린샷 비교           | Phase 3 (필요 시) |

### Figma 연동

| 도구                        | 용도                               | 도입 시점      |
| --------------------------- | ---------------------------------- | -------------- |
| **Figma REST API**          | 노드 속성/변수 조회, 이미지 export | Phase 2        |
| **Figma MCP (Claude Code)** | 대화형 디자인 확인, 즉석 비교      | 즉시 사용 가능 |
| **Figma Webhook**           | 디자인 변경 실시간 감지            | Phase 3        |
| **Figma Code Connect**      | 컴포넌트-코드 매핑 관리            | Phase 2~3      |

### AI 활용

| 도구                   | 용도                           | 도입 시점      |
| ---------------------- | ------------------------------ | -------------- |
| **Claude Code (로컬)** | 컴포넌트 코드 리뷰, Figma 비교 | 즉시 사용 가능 |
| **Claude API (CI)**    | PR 자동 리뷰, 체크리스트 검증  | Phase 3        |
| **Claude Code Hook**   | 커밋 전 자동 QA 체크           | Phase 3        |

---

## 5. CI/CD 파이프라인 최종 모습

```
PR 생성/업데이트
  │
  ├─ [기존] Lint → Typecheck → Build
  │
  ├─ [Phase 1] Vitest 컴포넌트 테스트
  │     └─ packages/react 테스트 실행
  │
  ├─ [Phase 1] Storybook 접근성 테스트
  │     └─ 모든 스토리 a11y 자동 검증
  │
  ├─ [Phase 1] Chromatic 시각 회귀
  │     └─ 변경된 컴포넌트 스냅샷 비교
  │
  ├─ [Phase 2] 토큰 영향 분석 (조건부)
  │     └─ tokens/ 파일 변경 시만 실행
  │     └─ 결과를 PR 코멘트로 남김
  │
  ├─ [Phase 2] Figma 드리프트 체크 (조건부)
  │     └─ 컴포넌트 파일 변경 시 실행
  │     └─ 코드값과 Figma 실측값 비교
  │
  └─ [Phase 3] AI 컴포넌트 리뷰 (조건부)
        └─ react/src/ 변경 시 실행
        └─ 체크리스트 기반 자동 리뷰

정기 실행 (주 1회)
  │
  ├─ [Phase 2] Figma 전체 드리프트 리포트
  │     └─ 모든 컴포넌트의 Figma↔Code 비교
  │     └─ 결과를 GitHub Issue로 생성
  │
  └─ [Phase 3] Figma 변경 감지
        └─ 지난주 변경된 노드 추적
        └─ 관련 컴포넌트 이슈 생성
```

---

## 6. 파일/디렉토리 구조 (예상)

```
NudgeEAPDesignSystem/
├── scripts/
│   ├── token-impact.mjs            # 토큰 영향 분석
│   ├── figma-sync.mjs              # Figma Variables 동기화
│   ├── figma-drift-check.mjs       # Figma↔Code 드리프트 비교
│   ├── figma-change-detect.mjs     # Figma 변경 감지 → 이슈
│   └── ai-qa-check.mjs            # AI 기반 QA 체크
│
├── packages/react/
│   ├── src/
│   ├── test/                       # [새로 추가]
│   │   ├── setup.ts
│   │   ├── Button.test.tsx
│   │   ├── Badge.test.tsx
│   │   ├── Input.test.tsx
│   │   ├── Modal.test.tsx
│   │   └── Popup.test.tsx
│   └── vitest.config.ts            # [새로 추가]
│
├── apps/storybook/.storybook/
│   └── test-runner.ts              # [새로 추가] a11y 자동 테스트
│
├── metadata/
│   ├── componentInventory.json     # [기존] 컴포넌트 메타
│   └── figma-spec-checks.json     # [새로 추가] Figma 비교 대상 정의
│
├── .github/workflows/
│   ├── ci.yml                      # [수정] 테스트 step 추가
│   ├── chromatic.yml               # [수정] 활성화
│   ├── figma-drift-check.yml       # [새로 추가]
│   └── ai-review.yml              # [새로 추가]
│
└── .claude/
    └── component-qa-checklist.md   # [새로 추가] AI 리뷰 체크리스트
```

---

## 7. 우선순위 매트릭스

| 작업                            | 가치 | 난이도 | 우선순위                  |
| ------------------------------- | ---- | ------ | ------------------------- |
| Vitest + 컴포넌트 테스트        | 높음 | 낮음   | **P0 — 즉시**             |
| Chromatic 활성화                | 높음 | 낮음   | **P0 — 즉시**             |
| Storybook a11y CI 자동화 고도화 | 높음 | 중간   | **P1 — 1주 내**           |
| 토큰 영향 분석 스크립트         | 중간 | 낮음   | **P1 — 1주 내**           |
| Figma MCP 기반 즉석 비교        | 중간 | 없음   | **P1 — 즉시 (이미 가능)** |
| Figma Variables API 연동        | 중간 | 중간   | **P2 — 2주 내**           |
| Storybook Interaction 테스트    | 중간 | 중간   | **P2 — 2~3주**            |
| AI PR 자동 리뷰                 | 중간 | 중간   | **P2 — 3주**              |
| Figma Webhook 변경 감지         | 낮음 | 높음   | **P3 — 4주+**             |
| Figma vs Web 스크린샷 비교      | 낮음 | 높음   | **P3 — 4주+**             |

---

## 8. 성공 지표

### Phase 1 완료 시

- [ ] 모든 컴포넌트(5개)에 단위 테스트 존재, CI에서 실행
- [ ] PR마다 Chromatic 시각 회귀 체크 통과 필수 또는 skip 정책 명확화
- [x] 접근성 위반이 있는 스토리가 CI에서 실패
- [ ] `pnpm test` 한 번에 전체 QA 가능

### Phase 2 완료 시

- [ ] 토큰 변경 PR에 영향 분석 코멘트가 자동으로 달림
- [ ] `pnpm figma:check`로 Figma↔Code 드리프트 확인 가능
- [ ] 주간 드리프트 리포트가 GitHub Issue로 자동 생성

### Phase 3 완료 시

- [ ] 새 컴포넌트 PR에 AI 리뷰가 자동으로 달림
- [ ] Figma 디자인 변경 시 24시간 내 관련 이슈 생성
- [ ] 주요 상호작용 컴포넌트에 Interaction 테스트 존재

---

## 9. 즉시 실행 가능한 액션

Phase 1에 앞서, 지금 바로 할 수 있는 것들:

1. **Figma MCP로 현재 드리프트 확인** — Claude Code에서 `get_design_context`로 Button(508:6962) 확인 후 코드와 비교
2. **Chromatic 프로젝트 생성** — https://www.chromatic.com 에서 프로젝트 등록, 토큰 발급
3. **PR 체크리스트 강제** — GitHub Branch Protection Rule에서 PR 체크리스트 항목 미완료 시 merge 차단
4. **`pnpm test` 스크립트 추가** — 아직 테스트가 없어도 스크립트를 먼저 만들어두면 자연스럽게 테스트 작성이 시작됨

---

## 변경 이력

| 날짜       | 버전 | 내용                                                    |
| ---------- | ---- | ------------------------------------------------------- |
| 2026-04-12 | v1.0 | 초안 작성 — 3단계 로드맵, 도구 선택, CI 파이프라인 설계 |
