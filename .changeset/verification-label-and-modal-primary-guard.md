---
"@nudge-design/react": patch
"@nudge-design/styles": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

본인인증 UI 정리(FieldActionRow label · 인증코드 자간/placeholder) · 캐포비 모달 노랑 CTA 재발 가드

목업 피드백에서 드러난 본인인증 화면 회귀 4건을 DS 근본에서 닫는다.

- **FieldActionRow `label` 신설(react/styles/html 미러)** — 라벨이 필요한 인증 row(예: "휴대폰 번호" + [인증번호 받기])에서 라벨을 손으로 버튼과 같은 줄에 욱여넣어 버튼이 라벨 높이에 떠 어긋나던 회귀를 막는다. 이제 `label` 을 넘기면 라벨은 한 줄 위, 입력+버튼은 인라인으로 컴포넌트가 정렬한다.

- **VerificationCodeInput 자간/placeholder** — 코드 값의 `letter-spacing` 을 0.08em → normal 로(단일 필드에서 숫자가 부자연스럽게 벌어져 어색하던 자간 수정). 기본 placeholder 도 "인증번호 6자리" → "인증번호 입력"(헬퍼가 이미 6자리를 안내해 중복 제거). (react/html/styles 미러)

- **캐포비 모달/팝업 노랑(primary) CTA 재발 가드** — 색 캐스케이드는 이미 토큰으로 잡혔지만, 작성자가 모달 footer 버튼에 `color="primary"` 를 쓰거나 `color` 를 생략(Button 기본값이 primary)하면 여전히 노랑이 됐다(5회+ 재발의 진짜 원인). `validate_html_mockup` 에 `cashwalk-biz-modal-primary-cta`(error: 확인/팝업 모달 footer 의 primary/색생략 버튼 → 검정 neutral 요구, 대형 선택/데이터 모달은 면제) + `cashwalk-biz-modal-footer-stacked`(warn: 2버튼 세로 스택 금지 — 라벨 축약 방향) 룰을 추가하고, Modal·cta-group·FieldActionRow 가이드에 "모달 버튼 color 생략 금지(기본 노랑)·2버튼 가로 유지·전송 후 [재전송] 토글"을 명시했다.
