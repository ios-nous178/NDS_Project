---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/%F0%9F%93%9A-%EB%84%9B%EC%A7%80EAP---Library?node-id=1736-581
sizeMatrix:
  image (PC/MO): 80 / 64 — 현재 코드 base=64 (PC 80 은 device prop 도입 시 · planned). 임의 리사이즈 금지.
  title (PC/MO): Headline5(18) / body1(16) — 둘 다 Bold·Text/Strong. (Figma "Headline5(16)" 라벨=코드 body1 16, off-by-one)
  subtitle (PC/MO): Body1(16) / Body2(15) — Regular·Text/Subtle
  gap: image→title 16 · title→subtitle 8(PC)/6(MO) · text→button 12
---

## summary

데이터/검색 결과/기록 없음(`status="empty"`) + 결과 화면(`status="success|error|info"` — 결제 성공·404·권한 없음 등)을 한 anatomy 로 표시. anatomy = **이미지(`icon`) / 타이틀(`title`) / 서브타이틀(`description`) / 버튼(`action`)**. 단순 '없음' 메시지 대신 다음 액션(추가하기 / 다시 검색 / 홈으로)을 제안한다. 타이틀은 Bold·Text/Strong, 서브타이틀은 Body2·subtle 한 단계 약하게(Figma 1736:581).

## pitfalls

- **Figma `show*` ↔ 코드 conditional render.** 코드는 별도 show prop 을 두지 않는다 — 해당 슬롯(`icon`/`description`/`action`)을 생략하면 그 행이 숨겨진다. Figma `Image`↔`icon`, `Subtitle`↔`description`, `Button`↔`action` (html 은 `hide-icon` 으로 이미지 끔).
- **Figma use-case → `status`.** EMPTY→`empty` · ERROR→`error` · SEARCH(검색 결과 없음)→`empty`(보통 action 없이) · PERMISSION→`info` · COMPLETE→`success` · NO-SUBTITLE→`description` 생략. PC/MO 사이징은 frontmatter `sizeMatrix` 참조 — 현재 코드 base=MO, PC variant 는 device prop 으로 추후(YAGNI 보류).

- title 만 있고 description / action 누락 — 사용자에게 다음 행동을 안내하지 않음(단, 검색 결과 없음처럼 후속 액션이 없으면 `action` 생략이 맞다).
- **타이틀 = 서브타이틀 중복 금지** — 핵심 메시지는 타이틀 한 줄, 서브타이틀은 부연. 같은 말을 두 번 쓰지 않는다.
- **서브타이틀이 3줄 이상**으로 길어지면 ResultState 가 아니라 모달 / 별도 페이지로 — ResultState 는 짧은 상태 안내용.
- **ResultState 안에 다른 카드 / 리스트를 배치하지 말 것** — 결과 화면은 단일 메시지 + 단일 액션. 콘텐츠 컨테이너가 아니다.
- 인라인 placeholder ↔ 풀페이지 결과 화면의 차이는 `status` 가 아니라 `minHeight` 로 조절한다. 빈 리스트는 작게(예: 200), 결제 성공·404 결과 화면은 `minHeight="60vh"` 처럼 크게. **같은 컴포넌트, altitude 만 다름.**
- 에러/성공 결과에는 반드시 `status="error|success"` — 색·기본 글리프가 시멘틱하게 바뀐다. status 없이 중립 빈상태로 에러를 표현하면 시그널이 약함.
- 인라인 placeholder 를 footer/nav 위로 풀스크린 채우지 말 것 — 영역 안 placeholder 면 `minHeight` 를 작게 둔다(풀페이지는 결과 화면 전용).
- `icon` 을 직접 주면 `status` 기본 글리프를 덮어쓴다(색은 `status` 가 계속 구동). 프로젝트 일러스트가 있으면 `icon` 으로 주입.
- **이미지 임의 리사이즈 금지** — PC 80 / MO 64 로 통일된 design intent(현재 코드 base=64). 인라인 px 로 키우거나 줄이지 않는다.

## recommended

- 버튼은 **다음 행동이 있을 때만** + 의미 있는 라벨("다시 시도" / "홈으로" / "추가하기" — "확인" 같은 무의미 라벨 금지).
- 오류 / 완료 결과에는 액션(재시도 / 다음 단계)을 **필수**로 — 사용자가 막다른 길에 갇히지 않도록.
- 대기 / 로딩 상태에는 **액션을 끈다**(아직 다음 행동이 정해지지 않은 상태에 버튼을 노출하지 않는다).
- status: 빈 리스트/검색결과 `empty`(기본·중립), 결제·제출 성공 `success`, 404·실패 `error`, 안내·점검중 `info`
- 결과 화면(풀페이지)은 `minHeight="60vh"` + `action` 에 1차 CTA(홈으로/다시 시도)

## examplesHtml.do

```html
<!-- 인라인 빈 상태 (action 슬롯) -->
<nds-result-state status="empty" title="아직 작성한 일기가 없어요" description="오늘의 감정을 기록해 보세요">
  <button is="nds-button">작성하기</button>
</nds-result-state>
<!-- 풀페이지 결과(성공) -->
<nds-result-state status="success" min-height="60vh" title="결제가 완료됐어요" description="이용 내역은 마이페이지에서 확인할 수 있어요">
  <button is="nds-button">홈으로</button>
</nds-result-state>
<!-- 검색 결과 없음 (action 없이) -->
<nds-result-state status="empty" title="검색 결과가 없어요" description="다른 검색어로 다시 시도해 보세요"></nds-result-state>
```

## examplesHtml.dont

```html
<!-- 에러인데 status 없이 중립 빈상태 — 시그널 약함 -->
<nds-result-state status="empty" title="페이지를 찾을 수 없어요"></nds-result-state>
<!-- 타이틀과 서브타이틀이 같은 말 — 중복 -->
<nds-result-state status="error" title="오류가 발생했어요" description="오류가 발생했어요"></nds-result-state>
```
