---
"@nudge-design/styles": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

입력 계열 컴포넌트(SearchInput·Autocomplete·PhoneInput·AddressSearch) 가 기본 Input 과 **동일한 `--nds-input-*` 토큰**을 쓰도록 통일 — 브랜드별 인풋 외형이 따로 놀던 drift 제거.

**문제**: Input/Select 는 필드 박스 치수를 `--nds-input-height` · `--nds-input-radius` · `--nds-input-padding-x` · `--nds-input-border-color` · `--nds-input-background` 슬롯으로 두어 브랜드가 cascade 로 덮을 수 있는데(예: 캐포비 admin = height 40 / radius 4 / padding inset-input), Autocomplete·PhoneInput·AddressSearch 는 이 값들을 **리터럴로 하드코딩**(48 / radius 8)했고 SearchInput 은 `--nds-search-input-*` 자체 슬롯이 `--nds-input-*` 로 **fallback 하지 않아**, 같은 줄에 둔 인풋끼리 높이·라운드가 어긋났다(캐포비에서 검색 인풋만 커 보이는 회귀 등).

**해결**: 네 컴포넌트의 필드 박스 height/radius/padding-x/border-color/background 를 전부 `var(--nds-input-*, <기본값>)` 으로 교체. SearchInput 은 자기 슬롯 → `--nds-input-*` → 리터럴 순으로 체인. 이제 한 곳(`--nds-input-*`)만 브랜드가 덮으면 입력 계열 전부 따라온다 — 컴포넌트별 개별 수정 불필요.

**focus 보더도 통일**: 네 컴포넌트의 focus 보더가 제각각 `borderRole.focus`/`borderRole.brand`(= 캐포비 노랑)였던 걸 Input 과 동일한 `cv.input.borderFocus`(`--semantic-input-border-focus`, 캐포비 #111 검정)로 통일 — 같은 줄 인풋끼리 focus 색이 노랑/검정 섞이던 불일치 제거.
