---
"@nudge-design/tokens": patch
---

스토리북에만 살던 브랜드 컴포넌트 보정값(--nds-\*)을 토큰 SSOT 로 회수

- Trost/Geniet/Runmile/CashwalkBiz 의 칩·토글·바텀시트·카드·모달·인풋 테두리·푸터·페이지네이션 보정값이 이제 브랜드 CSS(dist/{brand}.css)에서 직접 나갑니다. 외부 프로젝트도 스토리북과 동일한 모습을 받습니다.
- `--font-web` 별칭이 base 토큰에 추가됐습니다 (`var(--font-family-default)`).
- Trost 의 `text-brand`(주황)·`border-brand`(#FFE600)·`text-inverse`(흰색)는 디자인 정의값으로 복원됐습니다 — 기존 스토리북 표시가 잘못된 값이었습니다.
