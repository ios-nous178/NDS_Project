# Nudge Design System — 설계 리뷰 브리프 (Fable 5용)

> 사용법: 아래 전체를 Fable 5에게 붙여넣으세요. 1차로 "진단"만 받고, 동의되는 항목만 골라 2차로 "해결안"을 받는 2단계를 권장합니다.

---

## 너의 역할

너는 **멀티브랜드 디자인시스템(DS)을 실제로 운영·확장해본 시니어 DS 아키텍트**다.
나는 칭찬이나 일반론("토큰 쓰세요", "접근성 챙기세요")이 필요 없다.
내가 원하는 건 **이 시스템의 구조적 가정이 어디서 깨지는지, 확장 시 어떤 병목이 터지는지**에 대한 날카로운 진단이다.

규칙:
- 일반적 모범사례 나열 금지. 반드시 **이 시스템의 구체적 구조**에 근거해서 말해라.
- 확신 없으면 "추측"이라고 명시해라. 모르는 부분은 나에게 되물어라.
- 좋은 설계 결정이면 "이건 유지해라"라고도 말해줘 (무조건 까라는 게 아니다).

---

## 시스템 개요

EAP(직원 멘탈케어) 플랫폼용 디자인시스템 모노레포. **5개 브랜드**를 한 코드베이스로 지원: Trost / Geniet / NudgeEAP / CashwalkBiz / Runmile.

규모 (실측):
- React 컴포넌트: **123개** (`packages/react/src/*.tsx`)
- Styles(CSS-in-TS): **119개** (`packages/styles/src/*.ts`)
- HTML 웹컴포넌트: **124개** (`packages/html/src/components/nds-*.ts`)
- Storybook 스토리: **147개**
- 브랜드 토큰 세트: 5개 (palette + semantic 분리)

### 핵심 아키텍처 결정 (= 리뷰 대상)

**1) "3면 미러" — 모든 컴포넌트가 3개 구현으로 존재**
- `packages/react/src/{Name}.tsx` — React 구현 (Props의 SSOT)
- `packages/styles/src/{Name}.ts` — CSS-in-TS (react/html 공용, 토큰 var 참조)
- `packages/html/src/components/nds-{name}.ts` — 바닐라 웹컴포넌트 (React 미러)
- 셋은 **수동으로 동기화**한다. `pnpm lint:mirror-parity`가 react↔html의 set/enum drift만 게이트한다.
- 왜 이렇게? 소비처가 둘이다 — 실제 앱은 React, AI가 생성하는 "목업"은 무번들러 HTML.

**2) 가이드 SSOT = MCP 서버 코드**
- 외부 프로젝트(npm으로 DS를 소비하는 쪽, 그리고 AI 에이전트)가 따르는 **사용 규칙·컴포넌트 함정·패턴은 전부 MCP 서버 안의 TS 코드**에 산다.
  - `packages/mcp/src/guides.ts` — `COMPONENT_GUIDES` / `PATTERN_GUIDES` / `DESIGN_PRINCIPLES` / `ADMIN_CMS_GUIDE` (문자열 가이드 본문)
  - `packages/mcp/src/tools/guides.ts` — 외부가 받는 CLAUDE.md 템플릿 본문
- 즉 문서가 아니라 **실행 가능한 MCP 도구**가 진리의 원천: `get_guide`, `find_component`, `find_icon`, `find_token`, `get_brand`, `build_singlefile_html`, `convert_html_to_ds_html`, `list_figma_sync_status` 등.
- MCP는 AI가 mockup HTML을 생성할 때 호출하는 런타임 검증·자료 제공자 역할도 한다 (validator 룰 내장).

**3) 토큰 두 갈래**
- `--semantic-*` — Figma와 1:1 정합되는 SSOT (색 bg/text/icon/fill/border/button*/input + 여백 gap/inset). Figma 노드 하나(171:6675)가 유일 SSOT, legacy 그룹은 전부 제거됨.
- `--nds-*` — DS 자체 컴포넌트 슬롯 (sidebar, chip, tooltip-bg, 브랜드별 슬롯 등).
- raw hex 신규 추가 금지. 브랜드별 색은 data-brand cascade가 아니라 **별도 :root CSS 파일 선택**으로 적용.

**4) 브랜드 차별화 방식**
- 토큰: 브랜드마다 `{brand}.palette.ts` + `{brand}.semantic.ts`.
- 같은 컴포넌트가 브랜드마다 다른 의미를 가질 수 있음. 예: "검정 secondary CTA"가 Geniet은 `color=secondary`, Cashpobi는 `color=neutral` (denylist + validator 경고로 가드).
- 브랜드 아이콘 글리프는 `[data-brand]` cascade + CSS mask로 swap.

**5) 외부 전파 = MCPB 릴리즈**
- DS 변경이 외부에 닿으려면 컴포넌트뿐 아니라 MCP 가이드·changeset·버전 bump까지 같이 손봐야 한다.
- 버전 SSOT는 4개 패키지 package.json, 루트·manifest는 미러(sync 스크립트가 drift 차단).
- 이 다단계 절차를 `/ds-component` `/ds-fix` `/ds-audit` `/ds-release` 슬래시 스킬로 자동화해 둠.

---

## 내가 특히 판단받고 싶은 결정들

각각에 대해 트레이드오프·실패 시나리오·대안을 말해줘:

1. **3면 미러를 "수동 동기화 + parity 린트"로 유지하는 게 지속가능한가?**
   123개 컴포넌트 × 3구현 = 차원이 늘수록 drift 비용이 커진다. React→HTML 코드 생성으로 가야 하나, 아니면 이 divergence를 의도적으로 유지할 가치가 있나? parity 린트가 set/enum만 잡고 동작·스타일 drift는 못 잡는 게 위험한가?

2. **가이드 SSOT를 "문서"가 아니라 "MCP 서버 코드(TS 문자열)"에 두는 설계.**
   장점은 알겠다(실행가능·런타임 검증·AI 소비). 단점·장기 리스크는? 가이드가 코드와 같은 레포·같은 릴리즈 사이클에 묶이는 게 문제될 지점은? 가이드 본문이 거대 문자열 상수인 게 유지보수에 어떤 부채를 만드나?

3. **5개 브랜드를 한 컴포넌트 셋으로 흡수하면서 "브랜드별 의미 차이"(neutral vs secondary 등)를 denylist+validator 경고로 가드하는 방식.**
   6번째 브랜드가 들어오면 이 모델이 깨지나? 브랜드별 예외가 누적되면 어디서 터지나?

4. **AI 목업 생성을 1급 소비처로 두는 것**(무번들러 HTML + MCP 런타임 검증 + validator 룰).
   이게 DS의 컴포넌트/토큰 설계 자체를 왜곡하고 있진 않나? "AI가 쓰기 좋은 DS"와 "사람이 쓰기 좋은 DS"가 충돌하는 지점이 있나?

5. **전반적 응집도**: 위 결정들이 서로 잘 맞물려 있나, 아니면 서로 잡아당기고 있나? 이 시스템에서 가장 먼저 부러질 약한 고리 하나만 꼽으면?

---

## MCP 서버 엔지니어링 품질도 같이 봐줘 (토큰 낭비 · 로깅 과다 · 응답 비대)

위 5개가 "설계 철학" 진단이라면, 이건 **MCP 서버 구현 자체의 비용·효율** 진단이다. 아래는 내가 측정한 실제 수치다 — 여기서 새는 곳을 짚어줘.

**A) 가이드 본문이 거대 인라인 상수**
- `packages/mcp/src/guides.ts` = **7,238줄**, 백틱 문자열 가이드 블록 **530개**. `tools/guides.ts`도 1,605줄.
- 우려: `get_guide`/`find_component` 같은 툴이 이 큰 문자열 본문을 **통째로 AI 컨텍스트에 반환**하면 호출 1번당 토큰이 크게 샌다. 가이드를 청크/지연/요약-먼저 후 상세-옵션 방식으로 줘야 하나? 한 파일에 530블록이 유지보수 부채인가?

**B) `afterCall` 단일 훅이 모든 툴 호출마다 수집기 4개를 fan-out** (`server.ts:1171`)
매 툴 호출마다 순차로:
1. `captureContext` — 로컬 컨텍스트 스냅샷(html 빌드 산출물 포함)
2. `captureTelemetry` — find_* 히트/미스 + 프롬프트를 `localhost:8091/api/ingest`로 fire-and-forget egress
3. `captureTranscriptFeedback` — **매 호출 transcript 파일을 디스크에서 읽어** 직전 user 피드백 추출
4. `recordObservability` — build/validation/quality 기록 후 결과를 `_observability` 키로 **래핑해서 반환**

- 우려 1 (로깅 과다): 읽기 전용 조회(`find_token` 한 번)에도 transcript 디스크 읽기 + egress fetch + 컨텍스트 스냅샷이 전부 도나? **툴 종류별 게이팅·샘플링 없이 무차별**인 게 맞나?
- 우려 2 (응답 비대): `recordObservability`가 결과에 `_observability`를 덧붙이는데, 이게 **AI 컨텍스트로 흘러들어 토큰을 먹지 않나**? 텔레메트리/관측 데이터가 사용자(AI)에게 보일 이유가 있나, 아니면 서버 내부에만 남아야 하나?
- 우려 3 (결합도): 기본 전송지가 `localhost:8091`인데 headless/cron/외부 소비자 환경엔 그 서버가 없다. fire-and-forget이라 무해하다지만, 매 호출 실패하는 fetch가 누적 비용/지연을 만들지 않나? 끄는 스위치(`NUDGE_CONTEXT_COLLECTION=0`)가 기본값이어야 하는 건 아닌가?

**C) 파일 규모 분포** — `server.ts` 1,258줄 / `registry.ts` 910줄 / `observability-sink.ts` 697줄 / `telemetry-egress.ts` 429줄. 관측·텔레메트리 코드가 MCP 본체 대비 비대한가? 핵심(컴포넌트/토큰 조회)과 부가(관측)의 비중이 건강한가?

이 A/B/C에 대해서도 위와 같은 형식으로 진단해줘. 특히 **"호출 1번당 토큰·I/O·네트워크 예산"** 관점에서 가장 큰 낭비 1~2개를 콕 집어줘.

---

## 출력 형식

각 진단 항목을 이렇게:

```
### [제목]
- 문제: (이 시스템의 구체적 구조에 근거)
- 왜 위험: (어떤 상황에서 실제로 터지는가)
- 대안: (구체적으로. "검토하라"가 아니라 "X를 Y로")
- 영향도: 상 / 중 / 하
- 확신도: 높음 / 보통 / 추측
```

두 묶음으로 나눠서 줘:
- **묶음 1 — 설계 철학** (위 "판단받고 싶은 결정들" 기반): 영향도 "상"부터 상위 5개.
- **묶음 2 — MCP 서버 구현 효율** (A/B/C 기반): "호출당 토큰·I/O·네트워크 낭비" 큰 것부터 상위 3개.

그 다음 맨 끝에 "내가 놓쳤을 수 있는 질문" 1~2개를 나에게 되물어라.

---

## (선택) 더 깊게 보고 싶으면 요청해

다음 파일을 붙여주면 더 구체적으로 본다고 말해줘 — 내가 추가로 제공할게:
- 대표 컴포넌트 3면 미러 1세트 (예: `Button.tsx` + `Button.ts` + `nds-button.ts`)
- `packages/mcp/src/guides.ts`의 `COMPONENT_GUIDES` 실제 발췌
- 브랜드 토큰 세트 1개 (`cashwalk-biz.semantic.ts`)
- 루트 `CLAUDE.md` 전문
