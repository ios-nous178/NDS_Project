---
"@nudge-design/react": patch
"@nudge-design/html": patch
"@nudge-design/tokens": patch
---

입력 라벨 간격 토큰 통일(`--semantic-gap-label` 8px) + AudioPlayer skip 아이콘 색 보정

- 신규 토큰 **`--semantic-gap-label`(8px)** — 입력 계열 전체(Input·Textarea·Select·TagInput·TimePicker·PhoneInput·AmountInput·SearchInput·AddressPicker) + FormField top-label 의 라벨↔컨트롤 세로 간격 SSOT. 기존 12px/10px 혼재와 Select/TagInput/TimePicker 의 `gap 8 + margin 4` 계산식을 단일 토큰 참조로 통일 — 라벨이 입력을 더 바짝 끌어안도록 8px 로 좁힘. 라벨 폰트는 이미 caption1(13px)로 통일된 상태 유지. 브랜드/인스턴스는 `--semantic-gap-label`(또는 컴포넌트별 `--nds-*-label-gap`) override 로 조정 가능.
- AudioPlayer 좌우(skip) 버튼 아이콘 색: `iconRole.strong`(#383838, 거의 검정) → `iconRole.normal`(#666). 보조 컨트롤을 가운데 play(브랜드)보다 디엠퍼사이즈.

렌더 영향: 입력 라벨↔필드 간격이 소폭 좁아짐(12→8px), AudioPlayer skip 아이콘 외곽선이 부드러워짐. **공개 API 변경 없음.**
