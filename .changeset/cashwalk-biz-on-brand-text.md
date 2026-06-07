---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

밝은 brand(캐포비·트로스트 노랑) 채움 위 흰 글씨 → 검정으로 전면 교정 + 캐포비 토글 ON 초록.

**문제**: brand 채움(`surface.brand`/`fill.brand`) 위에 `text/icon-inverse`(흰색)를 얹은 컴포넌트들이, brand 색이 밝은 노랑인 **캐포비(#FFD200)·트로스트(#FFF42E)** 에서 흰 글씨가 안 보였다.

**해결 — 새 토큰 없이 기존 `--semantic-button-text-default` 재사용.** 이 토큰은 모든 브랜드에서 이미 "brand 채움 위 글씨"(= 프라이머리 버튼 글씨)를 정확히 들고 있다: 어두운 brand(NudgeEAP·Geniet·Runmile) = 흰색, 노랑 brand(캐포비·트로스트) = 검정. brand 채움 + 흰 글씨 짝이던 컴포넌트의 글씨/아이콘 색을 `cv.button.textDefault`(`var(--semantic-button-text-default)`)로 교체 — 캐포비뿐 아니라 트로스트까지 자동 교정된다.

**적용**(brand 채움 위 흰 글씨/아이콘 → button-text-default): Checkbox·CheckboxTree·MultiSelect(체크표시), Calendar·DatePicker·TimePicker·TimeSlotPicker(선택), Stepper·Timeline(인디케이터), Tabs(color chip), Toggle(ON 라벨), ChatBubble, Popup·CoachMark·FAB·AudioPlayer·CounselorCard·FieldActionRow·Badge·Chip. react/styles/html 3면 모두.

**캐포비 토글 ON = 초록**: 캐포비 admin 토글의 켜짐은 브랜드 노랑이 아니라 초록(on/off 관습). `data-brand="cashwalk-biz"` cascade 로 ON 트랙을 status-success 초록 + inner-label 흰색으로(다른 브랜드 무영향).

어두운 채움(`fill.neutral` #333 · `surface.inverse` #111) 위 흰 글씨는 정상이라 그대로 둠.
