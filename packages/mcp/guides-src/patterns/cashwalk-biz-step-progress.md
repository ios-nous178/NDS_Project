---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3782-20029
metrics:
  bar: 8px · radius 6
  label: 스텝번호(Step N) + 제목 2단
  relatedPatterns: cashwalk-biz-page-form, cashwalk-biz-tab, cashwalk-biz-page-patterns
---

## summary

캐시워크 포 비즈니스 admin 의 단계형 진행 표시 — Stepper variant=bar(가로 막대 + 스텝번호/제목 2단 라벨). 다단계 폼(캠페인→광고→소재) 진행도. (구 StepProgress 는 Stepper variant=bar 로 통합됨.)

## rules

- 마크업: `<nds-stepper variant="bar" current="1" steps='[{"key":"c","label":"Step 1","title":"캠페인 만들기"},{"key":"a","label":"Step 2","title":"광고 만들기"},{"key":"m","label":"Step 3","title":"소재 만들기"}]'></nds-stepper>`. `current` 는 0-based.
- 각 스텝 = 막대(8px·radius 6) + 라벨(스텝번호 'Step N' + 제목). 상태: Done(idx<current)=막대 brand·라벨 normal medium / Current(idx===current)=막대 brand·라벨 strong bold / Upcoming(idx>current)=막대 border-normal·라벨 subtle.
- 다단계 Form 화면(`pattern:cashwalk-biz-page-form`)의 상단 진행도로 사용 — 단건 Form(`cashwalk-biz-form-layout`)에는 진행도 없음.
- 원형 번호형(`variant=numbered`)과 구분 — 어드민 가로 막대는 `variant=bar`.

## avoid

- 막대 색을 직접 지정 금지 — Done/Current=brand, Upcoming=border-normal 으로 토큰 자동 결정.
- 단건(한 화면) 폼에 진행도 막대를 붙이지 말 것 — 다단계 흐름에만.
