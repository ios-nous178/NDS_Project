# Nudge Tokens → Figma 플러그인

코드(`dist/next/figma-variables.json`, SSOT)에서 Figma **변수 + 바인딩된 비주얼 가이드**를 생성한다.
REST/토큰 불필요 — 현재 열려있는 Figma 파일에 네 계정으로 직접 실행한다.

## 무엇을 만드나

1. **변수 컬렉션** (이름기준 업서트, 재실행 안전)
   - `Primitive/Core` + `Primitive/{Trost,Geniet,CashwalkBiz,Runmile}` — 변수 이름은 brand-free (`coolGray/50`).
   - `Semantic` — **brand = mode** (nudge-eap·trost·geniet·cashwalk-biz·runmile). 값은 primitive 로 alias.
2. **🎨 Token Guide 페이지** — 스와치 fill 이 변수에 **바인딩**됨 → 변수 값이 바뀌면 색 자동 갱신.

## 쓰는 법

1. `pnpm --filter @nudge-design/tokens build` (또는 `pnpm --filter @nudge-design/tokens figma:plugin`) → `figma-plugin/code.js` 생성.
2. Figma 데스크톱 앱 → 메뉴 → Plugins → Development → **Import plugin from manifest…** → `packages/tokens/figma-plugin/manifest.json` 선택. (최초 1회)
3. 변수를 만들 **대상 파일**을 연다 (코드 기준 fresh — 기존 파일 참고 안 함).
4. Plugins → Development → **Nudge Tokens → Figma** 실행.
5. 끝나면 변수 패널에 컬렉션들 + `🎨 Token Guide` 페이지가 생긴다.

## 자동화 / 배포

- **변수 데이터 자동화**가 필요하면 플러그인 대신 `figma:variables --apply`(REST, CI-friendly) 사용 — `FIGMA_TOKEN`(Variables write, Enterprise) + `FIGMA_FILE_KEY` 필요.
- 플러그인은 **일회성 부트스트랩**: 한 번 실행해 비주얼 가이드를 만들면, 스와치가 바인딩돼 있어 이후 변수 변경을 **자동 추종**한다 (토큰 추가/삭제 시에만 재실행).
- 이 플러그인·스크립트는 **npm 에 배포되지 않는다** (`files: ["dist"]` — `figma-plugin/`·`scripts/` 는 dist 밖). 새 패키지·릴리즈 영향 0.
- 변수가 든 파일을 Figma **Team Library 로 publish** 하면 다른 파일에서 enable 해 쓸 수 있다 (변수 라이브러리·모드 = Enterprise).
