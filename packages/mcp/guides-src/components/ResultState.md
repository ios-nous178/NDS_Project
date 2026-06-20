---
{}
---

## summary

데이터/검색 결과/기록 없음(`status="empty"`) + 결과 화면(`status="success|error|info"` — 결제 성공·404·권한 없음 등)을 한 anatomy 로 표시. 단순 '없음' 메시지 대신 다음 액션(추가하기 / 다시 검색 / 홈으로)을 제안한다.

## pitfalls

- title 만 있고 description / action 누락 — 사용자에게 다음 행동을 안내하지 않음.
- 인라인 placeholder ↔ 풀페이지 결과 화면의 차이는 `status` 가 아니라 `minHeight` 로 조절한다. 빈 리스트는 작게(예: 200), 결제 성공·404 결과 화면은 `minHeight="60vh"` 처럼 크게. **같은 컴포넌트, altitude 만 다름.**
- 에러/성공 결과에는 반드시 `status="error|success"` — 색·기본 글리프가 시멘틱하게 바뀐다. status 없이 중립 빈상태로 에러를 표현하면 시그널이 약함.
- 인라인 placeholder 를 footer/nav 위로 풀스크린 채우지 말 것 — 영역 안 placeholder 면 `minHeight` 를 작게 둔다(풀페이지는 결과 화면 전용).
- `icon` 을 직접 주면 `status` 기본 글리프를 덮어쓴다(색은 `status` 가 계속 구동). 프로젝트 일러스트가 있으면 `icon` 으로 주입.

## recommended

- status: 빈 리스트/검색결과 `empty`(기본·중립), 결제·제출 성공 `success`, 404·실패 `error`, 안내·점검중 `info`
- 결과 화면(풀페이지)은 `minHeight="60vh"` + `action` 에 1차 CTA(홈으로/다시 시도)

## examplesHtml.do

```html
<!-- 인라인 빈 상태 -->
<nds-result-state title="아직 작성한 일기가 없어요" description="오늘의 감정을 기록해 보세요" action="작성하기"></nds-result-state>
<!-- 풀페이지 결과(성공) -->
<nds-result-state status="success" min-height="60vh" title="결제가 완료됐어요" description="이용 내역은 마이페이지에서 확인할 수 있어요" action="홈으로"></nds-result-state>
```

## examplesHtml.dont

```html
<!-- 에러인데 status 없이 중립 빈상태 — 시그널 약함 -->
<nds-result-state title="페이지를 찾을 수 없어요"></nds-result-state>
```
