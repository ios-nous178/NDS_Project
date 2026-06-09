---
"@nudge-design/styles": patch
"@nudge-design/react": patch
---

Modal·Popup·ConfirmTooltip·TagInput: 캐포비 검정 CTA 를 secondary → neutral 토큰으로 통일

캐포비(cashwalk-biz)는 Figma ButtonGuide 상 tone 이 Primary + Neutral 둘뿐이고 Secondary 가 없는데도, 모달/팝업/popconfirm 확정 버튼·TagInput 추가 버튼이 `button.bgSecondary` 를 참조하고 있었다. (TagInput 은 타 브랜드 영향을 막기 위해 base 는 secondary 유지하고 `[data-brand="cashwalk-biz"]` 게이트로만 neutral override.) 이 탓에 "캐포비엔 secondary 없음(neutral 사용)"이라는 `cashwalk-biz-no-secondary` 검증룰·Button 가이드와 모순돼, 작성자가 footer 버튼 색을 잘못(primary 노랑) 쓰는 오용의 원인이 됐다. confirm 을 `button.bgNeutral`(검정 #111)/`textNeutralSolid`(흰)/`bgNeutralHover` 로 바꿔 캐포비 전역 taxonomy 와 일치시킨다(시각은 동일한 검정, 색은 `[data-brand="cashwalk-biz"]` cascade 로만 적용 — 타 브랜드 무영향).
