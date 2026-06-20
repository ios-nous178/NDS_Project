# @nudge-design/mockup-core

DS **목업 빌드/검증 코어**. `@nudge-design/mcp` 와 데스크탑 카탈로그가 공유하는 내부 엔진입니다. **비공개(`private`)** — npm 배포되지 않습니다.

## 의존 / 소비

- 의존: `tokens` · `assets` · `react` · `html`
- 소비: `@nudge-design/mcp`(MCP 도구), `apps/desktop`

## 역할

외부 소비자가 작성한 HTML/`<nds-*>` 목업을 **빌드·검증·품질채점**하는 순수 로직을 담습니다. MCP 서버는 이 코어를 도구로 감싸 노출합니다:

- 단일 파일 HTML 빌드 (`build_singlefile_html` 의 코어)
- 목업 검증 (raw hex/px 차단, prop 매칭, project cascade, primary 과다 등 룰)
- 목업 품질 점수 (`score_mockup_quality` 의 채점 로직)
- HTML → DS HTML 변환

## 왜 분리?

MCP(외부 배포)와 데스크탑(내부)이 같은 검증/빌드 로직을 써야 하므로, 중복 없이 한곳에 둔 공용 코어입니다. 검증 룰을 바꾸려면 여기를 고치고, 외부 전파는 `/ds-release`(MCP)로 이어집니다.

> 사용자/외부 소비자는 이 패키지를 직접 import 하지 않습니다 — MCP 도구를 통해 간접 사용합니다.
