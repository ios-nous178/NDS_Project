---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20029
---

## summary

**다단계 작업의 현재 진척 *표시*** (지금 몇 단계인지 보여주는 막대/원, 입력 컨트롤 아님). variant=numbered|dots(원형 인디케이터 — 가입/결제/온보딩) + variant=bar(가로 막대 + 스텝번호/제목 2단 라벨 — 캐시워크 for Business 어드민 다단계 흐름, 구 StepProgress 흡수). 상태(completed/current/upcoming)는 current 인덱스로 자동 계산 — per-step status 는 받지 않음. (시간순 이벤트 로그=Timeline, 폼 콘텐츠+네비 컨테이너=MultiStepForm.)

## pitfalls

- status 는 prop 이 아님 — steps 에 {key,label,title?} 만 주고 상태는 current(0-based)로 결정. 'status' 를 박으면 무시됨.
- variant 는 numbered|dots|bar 뿐 — 'horizontal'/'vertical' 같은 값은 없음(Stepper 는 항상 가로). 세로 방향 트래커가 필요하면 Timeline(direction='vertical').
- title 은 variant=bar 의 두 번째 라벨 줄(예: '캠페인 만들기'). numbered/dots 에서는 무시됨 — 원형 단계명은 label 사용.
- 막대(bar) 색을 직접 지정 — completed/current 는 브랜드색, upcoming 은 border-normal 로 토큰 자동 결정. hex 박지 말 것.
- 현재 단계가 마지막인데 current 를 그대로 두면 completed 신호가 안 뜸 — 전부 완료는 current=steps.length.

## examplesHtml.do

```html
<!-- 원형 단계 -->
<nds-stepper current="1" variant="numbered" steps='[{"key":"info","label":"기본 정보"},{"key":"pay","label":"결제"},{"key":"confirm","label":"확인"}]'></nds-stepper>
<!-- 어드민 가로 막대(구 StepProgress) -->
<nds-stepper current="1" variant="bar" steps='[{"key":"c","label":"Step 1","title":"캠페인 만들기"},{"key":"a","label":"Step 2","title":"광고 만들기"},{"key":"m","label":"Step 3","title":"소재 만들기"}]'></nds-stepper>
```

## examplesHtml.dont

```html
<!-- variant="horizontal" + per-step status 는 존재하지 않는 prop — 무시됨. 막대 색 직접 지정 금지 -->
<nds-stepper variant="horizontal" steps='[{"label":"기본 정보","status":"completed"}]'></nds-stepper>
```
