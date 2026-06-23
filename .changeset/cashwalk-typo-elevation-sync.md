---
"@nudge-design/tokens": patch
---

Typography·Elevation 프리미티브 Figma(캐시워크 라이브러리) 정합

- **Headline 스케일 6단계로 확장** — Figma 캐시워크 Typography(214:56) 정합. `headline-3` 24→**26**/36, `headline-4` 20→**24**/32, `headline-5` 18→**20**/28, **`headline-6`(18/26) 신규**. (Display·Headline1·2·Body·Caption·Label 은 불변.) ⚠️ headline3/4/5 를 쓰는 컴포넌트(Heading `h3`~`h5`, `<Text variant="headline3|4|5">`)는 폰트가 **한 단계 커집니다** — 의도된 디자인 리프레시. 더 작은 18px 가 필요하면 신규 `headline6` 사용.
- **Elevation 4단계 재정의** — Figma 캐시워크 Elevation(67:56) 정합. 단일 drop-shadow 4단계로 통일: **E1 Card** `0 1px 3px /8%` · **E2 Dropdown** `0 2px 8px /10%` · **E3 Popover** `0 6px 16px /12%` · **E4 Modal** `0 12px 32px /16%`. 구 2겹 그림자 `e2` 폐지, `--shadow-4` 신규. **Modal·Drawer 가 E3→E4** 로 이동(더 깊은 그림자), Popover/Confirm 은 E3, Dropdown·Select·Datepicker 류는 E2 유지. `elevationLevel.modal` 도 E4 로 정렬(`popover` 별칭 추가).
