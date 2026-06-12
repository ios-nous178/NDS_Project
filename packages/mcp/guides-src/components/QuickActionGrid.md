---
{}
---

## summary

홈 빠른 액션 그리드. 4-6칸 아이콘+라벨, 배지 지원. 4칸이 기본 균형.

## pitfalls

- 라벨이 길면 줄바꿈됨. 4글자 이하 권장.
- 5칸은 배치가 어색 — columns=4 + 8개(2행) 또는 columns=3 사용.
- 배지는 알림 카운트(숫자) 또는 짧은 라벨('N','NEW') 위주. 긴 텍스트 X.
- **icon = inline SVG 문자열 (이름/이모지 아님).** `icon` 은 innerHTML 로 주입되므로 `"icon":"home"` 같은 이름이나 이모지를 넣으면 그대로 텍스트로 흘러나온다(이모지는 `validate_mockup` 의 emoji-banned 위반). `find_icon({ name })` → 반환 inline SVG 를 `icon` 에 넣는다. React `QuickActionGrid` 의 `icon: ReactNode` 와 대칭, nds-sidebar 와 동일 규약.

## recommended

- 홈 진입: 4칸 (감정기록 / 상담 / 챌린지 / 콘텐츠)
- 시간대별 명상: iconBg로 시간대 톤 표현
- 알림 진입: badge='3' 같은 미읽음 카운트

## examplesHtml.do

```html
<nds-quick-action-grid columns="3" gap="12"
  actions='[{"key":"home","label":"홈","icon":"<svg ...>...</svg>"},{"key":"log","label":"기록","icon":"<svg ...>...</svg>"}]'></nds-quick-action-grid>
<!-- icon = find_icon({name}) 가 준 inline SVG 문자열 (이름/이모지 아님 — innerHTML). actions 는 JSON 속성이라 SVG의 " 는 \" 로 이스케이프. 각 action 은 key 필수(없으면 렌더 제외) -->
<script>el.addEventListener("quick-action", e => navigate(e.detail.key));</script>
```

## examplesHtml.dont

```html
<!-- actions JSON 에 onClick 함수 박음 — WC attribute 는 함수 못 받음. key + quick-action 이벤트로 -->
<nds-quick-action-grid actions='[{"label":"홈","icon":"home","onClick":"go()"}]'></nds-quick-action-grid>
<!-- 틀린 점 2개 더: key 누락(렌더 제외) · icon 에 이름 "home"(텍스트로 흘러나옴 — inline SVG 여야) -->
```
