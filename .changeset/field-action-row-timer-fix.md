---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

FieldActionRow/VerificationCodeInput/CountdownTimer: 인증번호 입력 합성 정리

- **타이머 겹침 수정**: FieldActionRow 의 우측 타이머가 입력값/placeholder 위로 겹치던 문제를, 타이머가 있을 때 필드 콘텐츠에 우측 공간을 자동 예약(`data-has-timer`)해 해소. 더는 입력에 수동 paddingRight 가 필요 없다(`--nds-far-timer-reserve` 로 조정 가능).
- **박스 이중 스타일 제거**: FieldActionRow 의 범용 입력 스타일을 직접 자식 `> input` 으로 한정 — VerificationCodeInput/Input 같은 DS 컴포넌트가 자체 박스를 가질 때 테두리·패딩이 이중으로 얹히던 문제 해소.
- **CountdownTimer 시간 볼드 제거**: 카운트다운 값을 bold → regular(tabular-nums 유지)로 — 불필요한 강조 제거. 필드 안 타이머는 '남은 시간' 라벨 없이 값(mm:ss)만 두는 것을 권장.
