---
"@nudge-design/icons": minor
---

캐시워크(소비자앱) 아이콘 76종 추가 + cashwalk 를 공유 아이콘 프로젝트로 등록.

캐시워크 Figma export 에서 **새로운(기존 DS 와 중복 아닌) 아이콘 76종**을 `cashwalk-*` prefix 로 추가했습니다(65 mono · 11 multicolor). 팀워크·동네산책이 캐시워크와 같은 아이콘을 공유하는 베이스입니다.

- **바텀네비**(active/inactive) — `cashwalk-home-active` · `cashwalk-benefit(-active)` · `cashwalk-cashtalk(-active)` · `cashwalk-news(-active)` · `cashwalk-shopping` · `cashwalk-voucher(-active)`. 상태색(#111/#999)은 `currentColor` 로 정규화 → BottomNav 가 active/inactive 색 적용.
- **앱 아이콘** — cashwatch·cdpoint·mochall·treasure·ranking·reward·firecracker·route·watch·shoes·map-pin·qrcode·arrow-left/right·check-circle·question-circle-solid·warning-circle-solid/line·info-solid/line·megaphone·channel 등. 다색 일러스트 아이콘(treasure·firecracker 등)은 multicolor 로, 단색은 mono(currentColor)로 라우팅.
- **cashwalk 아이콘 프로젝트 등록** — `generate-icon-catalog` PROJECTS·projectOf, `check-icon-naming` PROJECTS 에 cashwalk 추가(cashwalk-biz 다음 = prefix 충돌 방지). 카탈로그·커버리지 보드에 Cashwalk 프로젝트로 분류.

- **variant 조각도 이미지 매칭으로 식별** — Figma 의 `color=*`/`style=*`/`state=*`/`type=*` 조각을 Common Icons 가이드와 대조해 Cash·Toggle(on/off)·Pin(solid/line)·Bell(/-add/-off)·Arrow(up/down) 로 명명·추가.

명명 규칙(kebab·`-solid`(not fill)·`noun-circle`) 통과. 단색=mono(currentColor)·다색 일러스트=multicolor 라우팅(clipPath 는 단색 취급).
