# 로컬 패키지 + Claude AI 목업 워크플로우

이 문서는 NudgeEAP 디자인 시스템을 **로컬 npm 패키지(.tgz)** 로 만들어, 별도 외부 프로젝트에서 Claude AI로 PRD → React 기반 목업을 생성하는 전체 흐름을 설명합니다.

## 1. 결정된 형태

| 항목               | 선택                                                                                |
| ------------------ | ----------------------------------------------------------------------------------- |
| 목업 형태          | (A) **React 기반** — Vite 미니 앱에서 `@nudge-eap/react` 컴포넌트를 import해서 렌더 |
| 목업 프로젝트 위치 | 이 모노레포 **바깥**의 별도 폴더 (예: `~/04_DPLaps/NudgeEAPMockups`)                |
| 워크플로우         | 기존 `harness/`와 분리된 **신규 흐름**                                              |
| 패키지 배포 방식   | `pnpm pack` → `.tgz` 파일을 외부 프로젝트에서 설치                                  |

> "HTML 목업"이라는 표현은 *브라우저에서 HTML로 렌더되는 결과물*을 의미. 작성 코드는 React(.tsx)이고 빌드된 산출물이 HTML/JS로 서빙됩니다.

---

## 2. 전체 그림

```
[NudgeEAPDesignSystem (모노레포)]
   ├── packages/tokens          ──┐
   ├── packages/react           ──┤  pnpm pack → .tgz 파일들
   ├── packages/icons           ──┤  (필수: 컴포넌트와 함께 자주 사용)
   └── packages/tailwind-preset ──┘  (선택: Tailwind 쓸 때만)
                                  ▼
                         [local-packages/ 폴더 (외부)]
                                  │
                                  ▼
[NudgeEAPMockups (외부 프로젝트)]      ← Claude AI가 여기서 작업
   ├── package.json (file:./local-packages/*.tgz)
   ├── src/mockups/    ← Claude가 생성
   ├── prds/           ← 사용자가 작성
   └── docs/MOCKUP_AUTHORING.md  ← Claude용 컨텍스트
```

### 패키지별 역할

| 패키지                       | 필수 여부      | 설명                                                                                                                                                    |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nudge-eap/tokens`          | **필수**       | 색상/간격/타이포 토큰 (CSS 변수 + JS)                                                                                                                   |
| `@nudge-eap/react`           | **필수**       | Button, Input, Tabs 등 컴포넌트                                                                                                                         |
| `@nudge-eap/icons`           | **필수(권장)** | SVG 아이콘 컴포넌트 (`SearchIcon`, `ArrowBackIcon` 등). `@nudge-eap/react`가 직접 의존하진 않지만, 실제 목업에서 입력창/버튼/내비 등에 거의 항상 사용됨 |
| `@nudge-eap/tailwind-preset` | 선택           | 외부 프로젝트에서 Tailwind를 쓸 경우만 필요. Vite + 일반 CSS면 생략 가능                                                                                |

---

## 3. 1단계 — DS 패키지 빌드 & 패킹

이 모노레포 루트에서:

```bash
# 1. 의존성 설치 (한번만)
pnpm install

# 2. 빌드 (tokens가 react/tailwind-preset의 의존성)
pnpm build --filter @nudge-eap/tokens
pnpm build --filter @nudge-eap/react
pnpm build --filter @nudge-eap/icons
pnpm build --filter @nudge-eap/tailwind-preset   # Tailwind 쓸 때만

# 3. tgz 패킹
mkdir -p ~/local-packages
pnpm --filter @nudge-eap/tokens          pack --pack-destination ~/local-packages
pnpm --filter @nudge-eap/react           pack --pack-destination ~/local-packages
pnpm --filter @nudge-eap/icons           pack --pack-destination ~/local-packages
pnpm --filter @nudge-eap/tailwind-preset pack --pack-destination ~/local-packages   # Tailwind 쓸 때만
```

결과:

```
~/local-packages/
  nudge-eap-tokens-0.1.0.tgz
  nudge-eap-react-0.1.0.tgz
  nudge-eap-icons-0.1.0.tgz
  nudge-eap-tailwind-preset-0.1.0.tgz   # 선택
```

> `pnpm pack`은 `package.json`의 `files` 필드에 정의된 것만 포함합니다 (`dist/` 디렉토리). 빌드를 빠뜨리면 빈 패키지가 됩니다.

### 3-1. DS를 수정한 뒤 다시 패킹할 때

```bash
# DS 폴더에서
pnpm build --filter @nudge-eap/tokens && pnpm build --filter @nudge-eap/react
pnpm --filter @nudge-eap/tokens pack --pack-destination ~/local-packages
pnpm --filter @nudge-eap/react  pack --pack-destination ~/local-packages

# 외부 목업 프로젝트에서
rm -rf node_modules/@nudge-eap
npm install   # 또는 pnpm install
```

> `.tgz`는 캐시되므로, 같은 버전을 반복 갱신할 때는 `package.json`의 `version`을 올리거나 외부 프로젝트의 `node_modules/@nudge-eap`를 직접 지우고 재설치하세요.

---

## 4. 2단계 — 외부 목업 프로젝트 생성

### 4-1. Vite + React + TS 프로젝트

```bash
cd ~/04_DPLaps
npm create vite@latest NudgeEAPMockups -- --template react-ts
cd NudgeEAPMockups
```

### 4-2. DS 설치

```bash
mkdir -p local-packages
cp ~/local-packages/nudge-eap-tokens-0.1.0.tgz local-packages/
cp ~/local-packages/nudge-eap-react-0.1.0.tgz  local-packages/
cp ~/local-packages/nudge-eap-icons-0.1.0.tgz  local-packages/
# Tailwind 쓸 때만:
# cp ~/local-packages/nudge-eap-tailwind-preset-0.1.0.tgz local-packages/

npm install ./local-packages/nudge-eap-tokens-0.1.0.tgz \
            ./local-packages/nudge-eap-react-0.1.0.tgz \
            ./local-packages/nudge-eap-icons-0.1.0.tgz
```

> 의존성 순서 주의: `@nudge-eap/react`와 `@nudge-eap/icons`는 `@nudge-eap/tokens`에 의존합니다. 한 줄로 같이 설치하면 npm이 알아서 처리하지만, 따로 설치한다면 `tokens` → 나머지 순서로.

`package.json`에 다음과 같이 잡힙니다:

```json
"dependencies": {
  "@nudge-eap/tokens": "file:local-packages/nudge-eap-tokens-0.1.0.tgz",
  "@nudge-eap/react":  "file:local-packages/nudge-eap-react-0.1.0.tgz",
  "@nudge-eap/icons":  "file:local-packages/nudge-eap-icons-0.1.0.tgz"
}
```

### 4-3. CSS 토큰 로드

`src/main.tsx` 최상단에 추가:

```tsx
import "@nudge-eap/tokens/css"; // 공통 토큰 (CSS 변수)
import "@nudge-eap/tokens/css/trost"; // 브랜드별 토큰 (필요한 브랜드 import)
import "@nudge-eap/react/styles.css"; // 컴포넌트 스타일
```

### 4-4. 라우팅 (목업 인덱스)

각 목업이 별도 페이지로 보이도록 간단한 라우팅을 둡니다.

```bash
npm install react-router-dom
```

`src/App.tsx` (스켈레톤):

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { mockupRegistry } from "./mockups/registry";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ul>
              {mockupRegistry.map((m) => (
                <li key={m.path}>
                  <Link to={m.path}>{m.title}</Link>
                </li>
              ))}
            </ul>
          }
        />
        {mockupRegistry.map((m) => (
          <Route key={m.path} path={m.path} element={<m.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
```

`src/mockups/registry.ts`에 Claude가 생성한 목업을 한 줄씩 추가하는 패턴.

---

## 5. 3단계 — Claude용 컨텍스트 자산

외부 프로젝트 루트에 다음 파일들을 만듭니다. **Claude가 일관된 결과를 내려면 이 컨텍스트가 핵심**입니다.

### 5-1. `CLAUDE.md` (외부 프로젝트용)

```markdown
# NudgeEAP Mockup Workspace

이 프로젝트는 `@nudge-eap/react` 디자인 시스템을 사용해 PRD로부터 목업을 생성하는 워크스페이스입니다.

## 작성 규칙

1. 모든 UI는 **반드시** `@nudge-eap/react`의 컴포넌트로 구성한다.
2. 컴포넌트가 없는 경우(예: Accordion, StarRating)에만 임시 구현 허용.
3. 색상/간격/타이포는 인라인 값 금지 — 토큰 CSS 변수 또는 컴포넌트 props만 사용.
4. 반응형은 `useIsMobile()` 패턴 (또는 자체 hook) 사용.
5. 새 목업은 `src/mockups/{Brand}{Page}.tsx` 형식으로 생성하고 `registry.ts`에 등록.

## 사용 가능한 컴포넌트

`docs/COMPONENT_REFERENCE.md` 참조.

## 사용 가능한 아이콘

`@nudge-eap/icons`에서 import. 예: `import { SearchIcon, ArrowBackIcon } from "@nudge-eap/icons"`.
사용 가능한 전체 목록은 `docs/ICONS_REFERENCE.md` 참조.

## 디자인 토큰

`docs/TOKENS_REFERENCE.md` 참조.

## 작업 루틴

사용자가 PRD(`prds/*.md`)를 주면:

1. PRD를 읽고 필요한 컴포넌트를 식별
2. `src/mockups/{Brand}{Page}.tsx` 생성
3. `registry.ts`에 등록
4. `npm run dev`로 브라우저에서 확인 안내
```

### 5-2. `docs/COMPONENT_REFERENCE.md`

DS 모노레포에서 자동 추출하는 게 가장 정확합니다. 다음 스크립트를 외부 프로젝트에 두세요.

`scripts/sync-component-docs.mjs`:

```js
// node scripts/sync-component-docs.mjs <DS_REPO_PATH>
// packages/react/src/*.tsx 의 export 와 props 타입을 긁어서
// docs/COMPONENT_REFERENCE.md 로 합칩니다.
```

(상세 구현은 별도. 임시로는 DS 모노레포의 `packages/react/src/index.ts`와 각 컴포넌트의 props 타입을 복사 붙여넣기.)

각 컴포넌트 항목 권장 형식:

````markdown
### Button

- import: `import { Button } from "@nudge-eap/react"`
- props:
  - `variant: "primary" | "secondary" | "assistive"`
  - `size: "sm" | "md" | "lg"`
  - `disabled?: boolean`
- 예시:
  ```tsx
  <Button variant="primary" size="md">
    확인
  </Button>
  ```
````

````

### 5-3. `docs/ICONS_REFERENCE.md`

`@nudge-eap/icons` 패키지의 export 목록. DS 레포의 `packages/icons/dist/index.d.ts`(또는 빌드 후 dist 디렉토리)에서 추출:

```bash
# DS 레포에서
ls packages/icons/dist/*.d.ts | xargs -I{} basename {} .d.ts | grep Icon$
````

목업 작성 시 Claude는 이 목록 안의 아이콘만 사용하도록 강제. 없는 아이콘은 임의 SVG 인라인 금지 — 사용자에게 추가 요청.

### 5-4. `docs/TOKENS_REFERENCE.md`

`@nudge-eap/tokens/css`가 노출하는 CSS 변수 목록 (`--color-*`, `--spacing-*`, `--font-*`).
DS 레포의 `DESIGN.md`에서 핵심만 발췌해서 둡니다.

### 5-5. `docs/PRD_TEMPLATE.md`

```markdown
# {페이지 이름}

- 브랜드: trost | geniet | nudge-eap
- 화면 크기: desktop | mobile | both
- 라우트: /{kebab-case}

## 목적

한 줄 요약

## 화면 구성

1. 상단: ...
2. 본문: ...
3. CTA: ...

## 데이터 (예시)

{
...
}

## 인터랙션

- 버튼 클릭 시 ...
```

### 5-6. `docs/MOCKUP_AUTHORING.md` (Claude용 절차서)

```markdown
# 목업 작성 절차

## INPUT

- `prds/{name}.md`

## 핵심 원칙 (위반 금지)

1. DS에 **이미 존재하는 컴포넌트/토큰을 임의로 재구현하지 말 것.**
   - 색상은 토큰 CSS 변수만 사용 (`var(--color-primary)`), 16진수 직접 입력 금지.
   - 간격/타이포도 토큰만 사용.
   - "비슷한" 컴포넌트를 새로 만들기 전에 반드시 `docs/COMPONENT_REFERENCE.md` 검색.
2. 아이콘은 `@nudge-eap/icons`에 있는 것만 사용. 인라인 SVG/이모지 금지.
3. 컴포넌트 props는 `docs/COMPONENT_REFERENCE.md`의 정의와 정확히 일치 (예: Chip은 `label`, Select는 `onValueChange`).

## STEP

1. PRD 읽기
2. `docs/COMPONENT_REFERENCE.md` & `docs/ICONS_REFERENCE.md` & `docs/TOKENS_REFERENCE.md` **전부 다시 읽기** (캐시 의존 금지)
3. PRD에 등장한 UI 요소를 → DS 컴포넌트로 매핑한 표를 머릿속으로 작성
4. `src/mockups/{Brand}{Page}.tsx` 생성
5. `src/mockups/registry.ts`에 추가
6. **셀프 체크 루프 (최대 3회) — 아래 별도 섹션 참조**
7. `npx tsc --noEmit` 통과 확인
8. 사용자에게 `http://localhost:5173/{path}` 안내

---

## 셀프 체크 루프 (최대 3회)

작성 후, 아래 검증을 **자기 자신이 다시 본다는 마음**으로 수행. 위반이 있으면 고치고, 다시 검증. **최대 3회까지 반복**. 3회 후에도 위반이 남아있으면 사용자에게 보고.

### 매 회차 검증 항목

검증 1) **`npm run lint:mockup`** — 자동 검증 (아래 8장)

- 위반 항목이 출력되면 모두 수정 후 다시 실행.

검증 2) **수동 자가 검토** — 작성한 `.tsx`를 처음부터 끝까지 한 줄씩 읽으며:

| 의심 패턴                                                    | 검사 방법                       | 위반 시 조치                                                   |
| ------------------------------------------------------------ | ------------------------------- | -------------------------------------------------------------- |
| 인라인 색상 (`#rrggbb`, `rgb(...)`, `rgba(...)`)             | grep 또는 시각 검토             | 토큰 CSS 변수로 교체                                           |
| 인라인 px/rem 간격 (`padding: 12px`, `margin-top: 8px`)      | grep                            | spacing 토큰으로 교체                                          |
| `<button>`, `<input>`, `<select>` 같은 native 요소           | grep                            | DS 컴포넌트로 교체                                             |
| 자체 정의 SVG (`<svg ...>`)                                  | grep                            | `@nudge-eap/icons`에 동일/유사 아이콘 존재하는지 확인 후 교체  |
| 새로 만든 함수형 컴포넌트 (`function MyCard...`)             | 시각 검토                       | DS에 동일 기능 컴포넌트 있는지 `COMPONENT_REFERENCE.md` 재검색 |
| 임의 className (Tailwind/일반)                               | grep                            | 토큰 변수 또는 DS 컴포넌트 props로 표현 가능한지 재고          |
| props 이름 추측 (예: Select에 `onChange`, Chip에 `children`) | `COMPONENT_REFERENCE.md`와 비교 | 정확한 props 이름으로 수정                                     |

### 회차 종료 조건

- **PASS**: 검증 1, 2 모두 위반 0건 → 루프 종료, 다음 STEP 진행
- **FAIL**: 위반이 하나라도 있음 → 수정 후 다음 회차로

### 3회차에도 FAIL인 경우

사용자에게 다음 형식으로 보고:
```

3회 셀프 체크 후에도 다음 항목이 해결되지 않았습니다:

- [위반 1] 위치: src/mockups/X.tsx:42 — DS에 정확히 매칭되는 컴포넌트를 못 찾음
- [위반 2] ...

판단이 필요한 부분:

- (예) "사이드 패널" 컴포넌트가 DS에 없음 — Modal로 대체할지, 임시 구현할지 결정 필요

```

```

---

## 6. 4단계 — Claude로 목업 생성하기

외부 프로젝트 루트에서 Claude Code 실행:

```bash
cd ~/04_DPLaps/NudgeEAPMockups
claude
```

대화 예시:

```
사용자: prds/trost-counseling-list.md 봐줘. 이거대로 목업 만들어줘.

Claude: PRD 읽고 docs/COMPONENT_REFERENCE.md를 참조해서
        src/mockups/TrostCounselingList.tsx 와 registry 등록 진행할게요.
        ...
```

`CLAUDE.md`와 `docs/MOCKUP_AUTHORING.md`가 자동으로 컨텍스트로 들어가므로,
사용자는 PRD 경로만 알려주면 됩니다.

---

## 6.5. 자동 검증 — `lint:mockup` 스크립트

셀프 체크 루프를 사람의 자가 검토에만 의존하면 누락이 생깁니다. **결정적인(determ) 정적 분석**을 한 단계 두면 루프가 안정됩니다.

외부 프로젝트 루트에 `scripts/lint-mockup.mjs`를 생성:

```js
// scripts/lint-mockup.mjs
// 사용법: node scripts/lint-mockup.mjs src/mockups/TrostList.tsx
//        npm run lint:mockup [-- src/mockups/TrostList.tsx]
import fs from "node:fs";
import path from "node:path";

const target = process.argv[2];
const files = target
  ? [target]
  : fs
      .readdirSync("src/mockups")
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => `src/mockups/${f}`);

// DS export 목록 (빌드시 자동 생성된 JSON 사용 권장 — docs/ds-manifest.json)
const manifest = JSON.parse(fs.readFileSync("docs/ds-manifest.json", "utf-8"));
const allowedComponents = new Set(manifest.components); // ["Button", "Input", ...]
const allowedIcons = new Set(manifest.icons); // ["SearchIcon", ...]
const tokenVars = new Set(manifest.tokens); // ["--color-primary", ...]

const violations = [];

for (const file of files) {
  const src = fs.readFileSync(file, "utf-8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    const ln = i + 1;
    // 1. 인라인 hex/rgb 색상
    if (/#[0-9a-fA-F]{3,8}\b|rgba?\s*\(/.test(line) && !line.includes("var(--"))
      violations.push({ file, ln, rule: "inline-color", line });
    // 2. 인라인 px (transform/translate 같은 정상 사용은 예외 처리 필요)
    if (/:\s*\d+(\.\d+)?(px|rem)\b/.test(line) && !/transform|translate|scale/.test(line))
      violations.push({ file, ln, rule: "inline-spacing", line });
    // 3. native button/input/select (Modal close 등 예외는 주석으로 허용)
    if (/<\s*(button|input|select|textarea)[\s>]/.test(line) && !line.includes("// allow-native"))
      violations.push({ file, ln, rule: "native-element", line });
    // 4. 자체 SVG
    if (/<\s*svg[\s>]/.test(line)) violations.push({ file, ln, rule: "inline-svg", line });
    // 5. 알 수 없는 토큰 변수
    const tokenMatch = line.match(/var\((--[\w-]+)\)/g) ?? [];
    for (const m of tokenMatch) {
      const v = m.replace(/var\(|\)/g, "");
      if (!tokenVars.has(v)) violations.push({ file, ln, rule: "unknown-token", line, detail: v });
    }
  });

  // 6. import한 컴포넌트가 DS에 존재하는지
  const importMatch = src.matchAll(/import\s*\{([^}]+)\}\s*from\s*"@nudge-eap\/(react|icons)"/g);
  for (const m of importMatch) {
    const pkg = m[2];
    const names = m[1].split(",").map((s) => s.trim().split(" as ")[0].trim());
    for (const name of names) {
      const allowed = pkg === "react" ? allowedComponents : allowedIcons;
      if (!allowed.has(name))
        violations.push({ file, ln: 0, rule: `unknown-${pkg}-export`, detail: name });
    }
  }
}

if (violations.length === 0) {
  console.log("OK: no violations");
  process.exit(0);
}
console.log(`${violations.length} violation(s):`);
for (const v of violations) {
  console.log(`  ${v.file}:${v.ln}  [${v.rule}]  ${v.detail ?? v.line?.trim() ?? ""}`);
}
process.exit(1);
```

`package.json`에 추가:

```json
"scripts": {
  "lint:mockup": "node scripts/lint-mockup.mjs"
}
```

### `docs/ds-manifest.json` 생성

DS 레포 빌드 후 외부 프로젝트로 복사. DS 레포에 다음 스크립트를 두는 게 깔끔:

```js
// DS 레포: scripts/emit-manifest.mjs
import fs from "node:fs";
const reactExports = fs
  .readdirSync("packages/react/dist")
  .filter((f) => f.endsWith(".d.ts") && !f.includes("internal"))
  .map((f) => f.replace(".d.ts", ""))
  .filter((n) => /^[A-Z]/.test(n) && n !== "index");
const iconExports = fs
  .readdirSync("packages/icons/dist")
  .filter((f) => f.endsWith(".d.ts"))
  .map((f) => f.replace(".d.ts", ""))
  .filter((n) => n.endsWith("Icon"));
const tokensCss = fs.readFileSync("packages/tokens/dist/tokens.css", "utf-8");
const tokens = [...tokensCss.matchAll(/--[\w-]+/g)].map((m) => m[0]);
fs.writeFileSync(
  "docs/ds-manifest.json",
  JSON.stringify(
    {
      components: reactExports.sort(),
      icons: iconExports.sort(),
      tokens: [...new Set(tokens)].sort(),
    },
    null,
    2,
  ),
);
```

→ DS 빌드 직후 `node scripts/emit-manifest.mjs` 실행 → 결과를 외부 프로젝트의 `docs/ds-manifest.json`으로 복사.

---

## 7. 트러블슈팅

| 증상                                    | 원인 / 해결                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| `Cannot find module '@nudge-eap/react'` | `dist/`가 비어있음 → DS 레포에서 `pnpm build --filter @nudge-eap/react` 다시 |
| 토큰 변수가 적용 안 됨                  | `main.tsx`에서 `@nudge-eap/tokens/css` import 누락                           |
| DS 수정이 외부에 반영 안 됨             | `.tgz`가 캐시됨 → `node_modules/@nudge-eap` 삭제 후 `npm install`            |
| 컴포넌트 props 타입 불일치              | 외부 React 버전과 DS의 peerDeps(`react>=18`) 불일치 확인                     |
| `pnpm pack`이 `dist`를 누락             | 빌드를 안 했거나 `package.json`의 `files` 필드 확인                          |

---

## 8. MCP 서버화 — 더 단단한 통합

위의 흐름은 **마크다운 파일(컴포넌트/아이콘/토큰 reference)을 Claude가 읽는 방식**입니다. 동작은 하지만 다음 약점이 있습니다.

- 마크다운이 stale해지기 쉬움 (DS는 진화하는데 docs는 손으로 갱신)
- Claude가 "있는 줄 알았던" 컴포넌트 환각 가능
- 검증을 외부 lint 스크립트로 별도 실행해야 함

이걸 **MCP(Model Context Protocol) 서버**로 묶으면, Claude가 도구로 직접 DS에 질의/검증할 수 있습니다.

### 8-1. 결론: 만들 수 있고, 만들면 좋습니다

이 워크플로우는 **MCP화에 매우 적합**합니다. 도구 인터페이스가 명확하고, DS 패키지가 이미 빌드 가능한 형태(`dist/`, manifest)이기 때문.

### 8-2. 제안하는 MCP 서버 구조

패키지 이름: `@nudge-eap/mcp` (DS 모노레포 내 신규 패키지로 추가)

#### Tool 목록

| Tool                  | 설명                                                                     | 반환                                 |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| `list_components`     | DS의 모든 React 컴포넌트 이름 + 한 줄 설명                               | `[{name, summary}]`                  |
| `get_component`       | 특정 컴포넌트의 상세 props/예제                                          | `{name, props[], examples[], notes}` |
| `search_component`    | 자연어 의도(예: "탭 UI")로 매칭되는 컴포넌트 후보 추천                   | `[{name, score, reason}]`            |
| `list_icons`          | 모든 아이콘 이름                                                         | `string[]`                           |
| `find_icon`           | 자연어(예: "검색")로 아이콘 후보 추천                                    | `[{name, score}]`                    |
| `list_tokens`         | 디자인 토큰 CSS 변수 + 값                                                | `[{name, value, group}]`             |
| `lookup_token`        | 의도(예: "primary 색상", "12px 간격")로 토큰 추천                        | `[{name, value, score}]`             |
| `validate_mockup`     | `.tsx` 소스를 받아 위반 항목 반환                                        | `[{rule, line, detail, suggestion}]` |
| `suggest_replacement` | 위반 라인에 대한 자동 수정 제안 (예: `#FF5722` → `var(--color-primary)`) | `{before, after, confidence}`        |

#### Resource 목록

| Resource URI               | 내용                              |
| -------------------------- | --------------------------------- |
| `ds://manifest`            | 위의 `ds-manifest.json` 그대로    |
| `ds://component/{name}`    | 컴포넌트 소스 + 추출된 props 타입 |
| `ds://tokens/css`          | `tokens.css` 원본                 |
| `ds://example/{component}` | 스토리북에서 발췌한 예시 코드     |

### 8-3. 셀프 체크 루프 (MCP 버전)

마크다운 + lint 스크립트로 했던 것보다 훨씬 강력해집니다:

```
[1회차]
1. 사용자가 PRD 제시
2. Claude: search_component 로 후보 탐색 → get_component로 props 확인
3. .tsx 작성
4. Claude: validate_mockup(작성한 파일) 호출
5. 위반 있으면 → suggest_replacement 호출 → 수정
[2회차]
6. 다시 validate_mockup 호출
7. 여전히 위반 있으면 수정
[3회차]
8. validate_mockup 통과 또는 사용자에게 보고
```

루프 사이에 외부 명령(`npm run lint:mockup`)을 띄울 필요가 없고, Claude가 **결정적인 응답을 가진 도구**를 호출하므로 환각 가능성이 크게 줄어듭니다.

### 8-4. 구현 단계

1. **manifest 생성기**: 위의 `emit-manifest.mjs`를 MCP 서버 시작 시 자동 실행 (또는 캐시).
2. **MCP 서버 스켈레톤**:
   - 언어: Node/TS (DS와 동일 스택)
   - SDK: `@modelcontextprotocol/sdk` (Anthropic 공식)
   - 위치: `packages/mcp/` (DS 모노레포 내) — 외부 프로젝트는 `npx @nudge-eap/mcp` 또는 로컬 경로로 실행
3. **사용자의 Claude Code 설정**: 외부 프로젝트의 `.claude/settings.json` 또는 `~/.claude/settings.json`에:
   ```json
   {
     "mcpServers": {
       "nudge-eap-ds": {
         "command": "node",
         "args": ["/path/to/NudgeEAPDesignSystem/packages/mcp/dist/server.js"]
       }
     }
   }
   ```
4. **외부 프로젝트의 `CLAUDE.md` 갱신**:
   ```markdown
   ## 도구 사용 규칙

   - 컴포넌트가 필요하면 먼저 `search_component` 호출
   - 아이콘이 필요하면 먼저 `find_icon` 호출
   - 토큰이 필요하면 먼저 `lookup_token` 호출
   - **목업 파일을 작성한 직후 반드시 `validate_mockup` 호출**
   - 위반이 있으면 최대 3회까지 수정 후 재검증
   ```

### 8-5. 단계적 도입 권장

처음부터 MCP를 만들지 말고, 다음 순서를 권장합니다:

1. **Phase 1 (지금)**: 6장의 마크다운 reference + 6.5장의 `lint:mockup` 스크립트로 시작. 가장 빠르고 검증 결과가 결정적.
2. **Phase 2**: PRD 처리 케이스가 5~10개 쌓이면, 자주 발생하는 위반 패턴을 lint 룰로 추가하고 manifest 자동 갱신을 GitHub Action으로.
3. **Phase 3**: 사용자 측에서 "Claude가 자꾸 X를 잘못 매핑한다"는 빈도가 높아지면, 그 부분만 MCP tool 한두 개로 시작 (`search_component`, `validate_mockup` 두 개만 있어도 큰 효과).
4. **Phase 4**: 위 도구들이 안정되면 풀 MCP 서버로.

이 단계적 접근의 이유: **루프의 검증 단계가 결정적이기만 하면(마크다운 read든 MCP tool이든) 환각 방지 효과는 비슷**합니다. MCP의 진짜 장점은 docs 동기화 자동화와 더 풍부한 추천(예: `suggest_replacement`)이라, Phase 1으로도 대부분 막힙니다.

---

## 9. 향후 개선 (선택)

- **로컬 레지스트리(Verdaccio)**: `.tgz` 갈아끼우기 대신 `npm publish` 흐름으로 자동화. 버전 관리가 깔끔해짐.
- **컴포넌트 docs 자동 동기화**: DS 레포에 GitHub Action을 두고, 컴포넌트 docs를 외부 프로젝트로 PR 생성.
- **Storybook 임베드**: 외부 목업 프로젝트에서 DS Storybook을 iframe으로 띄워 컴포넌트 카탈로그 참조용으로 사용.
- **Figma → PRD 자동 추출**: Figma MCP로 디자인 파일에서 PRD 초안 생성.

---

## 10. 체크리스트 (한 번 세팅할 때)

- [ ] DS 레포에서 `pnpm install` & `pnpm build --filter @nudge-eap/{tokens,react,icons}`
- [ ] DS 레포에서 `node scripts/emit-manifest.mjs`로 `docs/ds-manifest.json` 생성
- [ ] `pnpm pack`으로 `.tgz` 생성 (tokens, react, icons / Tailwind 쓰면 tailwind-preset 추가)
- [ ] 외부 프로젝트 `npm create vite@latest`로 생성
- [ ] `.tgz` install (tokens + react + icons)
- [ ] `main.tsx`에 토큰/스타일 CSS import
- [ ] `src/mockups/`, `prds/`, `docs/` 폴더 생성
- [ ] `CLAUDE.md`, `docs/COMPONENT_REFERENCE.md`, `docs/ICONS_REFERENCE.md`, `docs/TOKENS_REFERENCE.md`, `docs/PRD_TEMPLATE.md`, `docs/MOCKUP_AUTHORING.md` 작성
- [ ] DS의 `docs/ds-manifest.json`을 외부 프로젝트 `docs/`로 복사
- [ ] `scripts/lint-mockup.mjs` 작성 + `package.json`에 `lint:mockup` 스크립트 추가
- [ ] `react-router-dom` 설치 + `App.tsx` 라우팅 구성
- [ ] `npm run dev`로 빈 인덱스 페이지 동작 확인
- [ ] 첫 PRD 하나 작성하고 Claude로 목업 생성 테스트
