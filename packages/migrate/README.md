# @nudge-design/migrate (PoC)

React 앱 코드를 **Nudge DS 컴포넌트로 결정적으로 교체**하는 코드모드(jscodeshift). 비공개·실험 단계.

## 철학

DS 마이그레이션 = **codemod(기계적·결정적) + 사람/LLM(미묘한 것)** 하이브리드. 이 패키지는 *기계적* 부분만 — AST 기반이라 결정적이고, fixture 로 회귀 테스트된다. 의미가 미묘한 교체(커스텀 prop·조건부 로직)는 건드리지 않고 사람/LLM 에 남긴다.

> MCP(대화형 지식)와 별개. MCP 는 "뭘로 바꿀지"를 알려주고, 이 CLI 는 "기계적으로 바꿀 수 있는 것"을 결정적으로 바꾼다.

## 사용 (PoC)

```bash
nds-migrate src/**/*.tsx     # 인식된 패턴만 교체, 나머지는 그대로
```

## 현재 transform (3종)

| transform | 변환 | 보수 규칙 |
|---|---|---|
| **button** | `<button className="btn-primary\|secondary\|outline…">` → `<Button variant="solid\|soft\|outlined">` | 문자열 리터럴 className + 인식 클래스만 |
| **input** | 텍스트형 `<input type="text\|email\|…">` → `<Input>` (native attr 통과) | checkbox/radio/file/range/date·네이티브 size 속성·표현식 type → skip |
| **badge** | `<span className="badge badge-success\|error\|…">` → `<Badge color="…">` | "badge" 베이스 클래스 있을 때만 |

공통: 변경 시 `import { … } from "@nudge-design/react"` 자동 주입(기존 import 에 병합). 표현식 className(`{cx(...)}`)·미인식 패턴은 **건드리지 않음**(사람/LLM 몫). 여러 transform 은 CLI 가 순서대로 적용.

### codemod 대상이 아닌 것 (= LLM 영역)
- **Modal** — DS Modal 은 compound(`Modal.Root/Body/Header/Footer`)라 임의 앱 모달을 children 재구조화까지 결정적으로 바꿀 수 없음. 앱별 차이도 큼 → **codemod 제외, 사람/LLM 이 가이드 보고 조립**. (하이브리드 경계의 대표 예)

## 테스트

`src/transforms/__testfixtures__/<name>.{input,output}.tsx` 쌍 = 회귀 스냅샷. `pnpm test` 로 검증(현재 7 green: fixture 3 + 보수성 4).

## 로드맵

transform 점증(form-field·checkbox·radio·chip…) + **detector**(레포 AST 스캔 → "교체 후보 리포트", MCP read-only 도구) → CLI 가 적용. 검증은 소비 앱 typecheck + 비주얼 회귀(Chromatic/Playwright).
