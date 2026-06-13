# @nudge-design/migrate (PoC)

React 앱 코드를 **Nudge DS 컴포넌트로 결정적으로 교체**하는 코드모드(jscodeshift). 비공개·실험 단계.

## 철학

DS 마이그레이션 = **codemod(기계적·결정적) + 사람/LLM(미묘한 것)** 하이브리드. 이 패키지는 *기계적* 부분만 — AST 기반이라 결정적이고, fixture 로 회귀 테스트된다. 의미가 미묘한 교체(커스텀 prop·조건부 로직)는 건드리지 않고 사람/LLM 에 남긴다.

> MCP(대화형 지식)와 별개. MCP 는 "뭘로 바꿀지"를 알려주고, 이 CLI 는 "기계적으로 바꿀 수 있는 것"을 결정적으로 바꾼다.

## 사용 (PoC)

```bash
nds-migrate src/**/*.tsx     # 인식된 패턴만 교체, 나머지는 그대로
```

## 현재 transform

- **button** — 네이티브 `<button className="btn-primary|btn-secondary|btn-outline|...">` → `<Button variant="solid|soft|outlined">` + `import { Button }` 주입.
  - 보수적: className 이 **문자열 리터럴**이고 인식 클래스가 있을 때만. 표현식(`{cx(...)}`)·미인식은 **skip**.

## 테스트

`src/transforms/__testfixtures__/<name>.{input,output}.tsx` 쌍 = 회귀 스냅샷. `pnpm test` 로 검증.

## 로드맵

button → input·modal·badge 점증. detector(레포 스캔→교체후보 리포트)는 MCP read-only 도구로 별도. 검증은 소비 앱 typecheck + 비주얼 회귀.
