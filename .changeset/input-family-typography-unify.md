---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

입력 패밀리 타이포 통일 — 필드 15(body2) · 라벨 14(body3)

입력 컴포넌트들의 "입력 텍스트(필드값)"와 "폼 라벨" 글자 크기가 컴포넌트마다 제각각이던 것을 토큰으로 통일했다. raw px 가 아니라 typeScale 토큰으로 맞췄으므로 브랜드 cascade 가 그대로 작동한다(base = 필드 15 / 라벨 14, cashwalk-biz 는 자기 조밀 스케일로 필드 14 / 라벨 13 — 브랜드 내부 일관성 유지).

**필드(입력값) 텍스트 → body2 로 통일**

- Select·MultiSelect: 트리거(선택값)·드롭다운 옵션·검색·빈상태 (구 body3) → body2
- TagInput: stacked·inline 입력 (구 body3) → body2
- VerificationCodeInput: 코드 입력 (구 body1 16px) → body2 — "큰 숫자"가 아니라 미정합이었음
- PhoneInput: 국가 선택 드롭다운 옵션 → body2 (다이얼/번호 박스는 기존 body2 유지)
- (이미 body2 였던 Input·Textarea·SearchInput·AmountInput·ChatInput 은 불변)

**폼 라벨 → body3 로 통일 (구 caption1 13px 에서 상향)**

Input·Textarea·Select·SearchInput·AmountInput·PhoneInput·TagInput·FormField(default density)·AddressPicker·TimePicker 의 `__label`. (admin density 라벨 16px, Autocomplete 14px 는 그대로.)

**그 외 정리(같은 패스)**

- FormField 카운터 caption1(13) → caption2(12) — 같은 footer 행 helper(12)와 정합
- ChatInput 전송 버튼 아이콘색 raw `#fff` → `--semantic-icon-inverse-default` 토큰
- AmountInput preset pill radius 생값 `9999px` → `radius.pill` 토큰
- MultiSelect 선택수 카운트·PhoneInput 다이얼 박스에 누락된 line-height 보강

시각 출력은 base 기준 필드 +0~1px / 라벨 +1px 수준의 정합 조정이며 API 변화는 없다.
