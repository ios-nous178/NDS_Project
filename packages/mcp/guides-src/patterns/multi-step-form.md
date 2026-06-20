---
{}
---

## summary

다단계 폼(마법사)은 **DS 컴포넌트가 아니라 조립 패턴**이다. 진행 표시·단계 헤더·이전/다음 풋터는 이미 있는 조각(Stepper / Heading / FormSection / cta-group)이고, 다단계의 진짜 어려움(단계별 검증, 단계 간 데이터 보관, 뒤로 갔다 와도 값 유지, 비동기 검증, 제출)은 **앱이 소유하는 상태머신**이다. 예전 `<MultiStepForm steps={…} canProceed>` 컨테이너는 칠하는 픽셀이 progress+header+footer 뿐이고 어려운 건 전부 `canProceed` boolean 으로 떠넘기는 얇은 셸이라, 실사용 0·Figma 노드 없음으로 제거(강등)했다. 다단계 흐름은 아래 **조립 계약**을 그대로 따른다 — 새 셸 컴포넌트를 만들지 말 것. (단계 진척 *표시*만 = component:Stepper, 시간순 로그 = component:Timeline.)

## rules

- ⓪ 레이아웃을 먼저 고른다 — **화면전환(screen-swap)** vs **누적 노출(progressive disclosure)**. 둘 다 정규 패턴이고 상태 계약(①·③·④)은 동일, **표시 방식만** 다르다:
  - **화면전환** (기본 · 긴 마법사 · 단계별 검증 많음 · 회원가입/온보딩) — 한 번에 한 단계 본문만 보이고 갈아끼움. 진행=`Stepper`, 풋터=`이전(secondary)+다음/제출(primary)` 한 행(아래 ②). 단계 4+ 거나 단계마다 무거운 검증이면 이쪽.
  - **누적 노출** (짧은 모바일 폼 · 리뷰 작성처럼 단계 2~5개 · 한 화면 스크롤) — 완료한 단계가 **위에 그대로 남고 다음 단계가 아래로 추가 노출**된다. 진행=상단 **슬림 `ProgressBar`(N/총단계)**, **이전/다음 버튼 없음**(스크롤로 위 단계 수정), 풋터는 **마지막 단계에서만 취소/제출**. 6칸 스텝퍼를 좁은 모바일에 욱여넣지 말 것. 단계 사이 구분선은 `Divider`(상하 대칭 spacing — `component:Divider`).
- ① 상태는 앱이 소유한다(MUST) — 부모가 (a) 현재 단계 인덱스, (b) **모든 단계의 입력값을 한 state 객체**, (c) 단계별 유효성을 보관한다. 각 단계 컴포넌트에 값을 흩뿌리지 말 것 — 단일 SSOT 라야 뒤로/앞으로가 안전하다. (누적 노출도 동일 — 완료 단계 값은 state 에 남고 화면엔 계속 보인다.)
- ② (화면전환 한정) 구조는 4단 수직 스택으로 고정(MUST) — 위에서 아래로 **진행(Stepper) → 헤더(Heading) → 본문(FormSection/FormField) → 풋터(cta-group)**. 순서·구성을 바꾸지 말 것.
  - 진행 = `Stepper`(이산 단계, `current`=단계 인덱스). 단순 % 진행만이면 `ProgressBar` 도 가능하나 단계가 셀 수 있으면 Stepper 가 우선.
  - 헤더 = `Heading`(현재 단계 title + description). 단계마다 교체.
  - 본문 = `FormSection`/`FormField` 입력. 검증·합성은 pattern:form-validation 을 그대로 따른다.
  - 풋터 = pattern:cta-group — **이전(secondary) + 다음/제출(primary)** 한 행.
- ③ 전진은 게이팅한다(MUST) — 현재 단계가 **유효하기 전엔 '다음' 버튼을 disabled**. 클릭만으로 무효 단계를 넘기지 말 것(soft gate 금지). 검증 시점은 pattern:form-validation(onBlur + 단계 제출 시 일괄).
- ④ 값은 보존한다(MUST) — '이전' 후 다시 '다음' 하면 입력했던 값이 **그대로 복원**돼야 한다. 단계 전환으로 본문을 언마운트해 값을 잃지 말 것 — 값은 ①의 부모 state 에 남고 본문만 갈아끼운다.
- ⑤ 비동기 검증은 게이트에 묶는다(MUST) — 중복확인·인증 같은 async 결과는 boolean 으로 ③ 게이트에 연결. 대기 중엔 '다음' 버튼 로딩, **낙관적 전진 금지**(응답 전 다음 단계로 못 감).
- ⑥ 제출 계약(MUST) — 마지막 단계의 primary 는 '제출'(submitLabel). 제출 중 버튼 비활성+스피너, 폼 비활성. 서버 오류는 **모든 단계 값 보존** + 상단 Alert(component:NoticeAlert). 성공은 Toast + 다음 화면 이동.
- ⑦ 접근성(MUST) — Stepper 현재 단계 `aria-current="step"`. 단계 전환 시 **포커스를 새 단계 Heading 으로 이동**. 에러는 스크린리더에 알림(role/aria-live).
- ⑧ 컴포넌트 승격 기준(governance) — 다단계 셸을 다시 DS 컴포넌트로 만들려면 **2개 이상 프로젝트의 실제 채택 + Figma 가이드 노드** 둘 다 충족해야 한다. 둘 중 하나라도 없으면 이 패턴으로 조립한다(예전 셸이 제거된 이유).

## avoid

- 짧은 모바일 폼(리뷰 작성 등)에 **6칸 스텝퍼 + 이전/다음 풋터를 욱여넣기** — 단계 라벨이 잘리고 UI 가 답답하다. 단계 2~5개·모바일이면 누적 노출(⓪: 슬림 ProgressBar, 이전/다음 없음)을 쓴다.
- 누적 노출인데 단계마다 **화면을 통째로 갈아끼워 위 단계가 사라지기** — 누적 노출의 핵심은 완료 단계가 위에 남는 것. 갈아끼울 거면 화면전환 모델로.
- 진행+헤더+풋터만 그리고 어려운 건 `canProceed` boolean 으로 떠넘기는 **얇은 래퍼 컴포넌트를 새로 만들기** — 직접 조립 대비 가치가 없어 제거된 안티패턴이다.
- 검증 없이 클릭으로 단계 전진(soft gate) — ③ 위반.
- '이전' 시 본문 언마운트로 입력값 소실 — ④ 위반.
- 단계 값을 각 단계 컴포넌트 로컬 state 나 URL 에만 분산 보관 — 뒤로/앞으로 버그. 부모 단일 state 가 SSOT.
- 이산 단계에 ProgressBar 를 하드코딩 %로 — 셀 수 있으면 Stepper.
- 비동기 응답 전 낙관적 전진 — ⑤ 위반.
- 진행/버튼 색을 raw hex — semantic/state 토큰으로 5 프로젝트 자동 대응.

## readyMade.note

다단계 폼 1단계의 정규 조립 골격. 상태머신(단계 인덱스·단계별 값·유효성)은 **앱이 소유**하고, 아래 마크업의 `Stepper.current`·본문·'다음' `disabled`·헤더 텍스트를 앱이 단계마다 갈아끼운다. 색은 모두 토큰 — hex 직접 지정 금지.

## readyMade.html

```html
<!-- 다단계 폼 = 조립 패턴. 단계 인덱스/값/유효성은 앱 state. -->
<form style="display:flex; flex-direction:column; gap:24px; max-width:480px">
  <!-- ① 진행: Stepper.current = 앱의 단계 인덱스 -->
  <nds-stepper
    current="0"
    steps='[{"key":"info","label":"정보 입력"},{"key":"verify","label":"본인 인증"},{"key":"agree","label":"약관 동의"}]'>
  </nds-stepper>

  <!-- ② 헤더: 단계마다 교체 -->
  <nds-heading title="정보 입력" description="기본 정보를 입력해 주세요"></nds-heading>

  <!-- ③ 본문: 현재 단계의 입력(검증=pattern:form-validation). 단계 전환 시 값은 앱 state 에 보존 -->
  <nds-form-section>
    <nds-form-field label="이름">
      <nds-input placeholder="이름"></nds-input>
    </nds-form-field>
    <nds-form-field label="이메일">
      <nds-input type="email" placeholder="name@example.com"></nds-input>
    </nds-form-field>
  </nds-form-section>

  <!-- ④ 풋터: cta-group(이전 secondary + 다음 primary). '다음'은 현재 단계 유효 전까지 disabled -->
  <div style="display:flex; gap:12px">
    <nds-button variant="outlined" style="flex:1">이전</nds-button>
    <nds-button variant="primary" style="flex:1" disabled>다음</nds-button>
  </div>
  <!-- 마지막 단계에서만 '다음' → '제출'(submitLabel) + 제출 중 disabled+스피너 -->
</form>
```
