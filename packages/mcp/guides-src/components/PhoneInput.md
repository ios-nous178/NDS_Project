---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3001-40209
---

## summary

국가 코드 + 휴대폰 번호 입력. ISO code 관리 + 다이얼 코드는 countries 데이터에서 조회. 국기 이모지 없이 다이얼코드/ISO코드/국가명만 표시(텍스트 이모지 금지 규칙 준수). 레이아웃 = 국가코드 드롭다운 박스 + 번호 입력 박스가 분리된 두 박스(gap). 두 박스 모두 base Input 시멘틱 토큰(height 48 · radius md · border/background)을 상속하므로 project cascade(--nds-input-*)가 그대로 적용됨.

## pitfalls

- countryCode는 ISO code(KR, US 등)로 관리. '+82' 문자열을 state에 두지 말 것.
- value/onValueChange 는 숫자만 다룸(예: '01012345678'). autoFormat(기본 on)이 화면에만 하이픈(KR 3-4-4)을 붙임 — state 에 하이픈 든 문자열을 넣지 말 것.
- KR(+82) 외 국가는 하이픈 규칙 미정의라 자동 포맷 안 함(숫자 패스스루). 끄려면 autoFormat={false}.
- 기본 5개국(KR/US/JP/CN/GB) 외 필요하면 countries prop으로 직접 정의.
- 둥근 모서리/높이를 임의 px 로 박지 말 것 — base Input 토큰(--nds-input-radius/-height) 상속이므로 Input 과 자동 일관.

## recommended

- 회원가입: helperText='인증번호를 받을 번호를 입력해주세요'
- 에러: error + helperText='번호 형식이 올바르지 않아요'
- 프로필 표시: disabled로 변경 불가 표시

## examplesHtml.do

```html
<nds-phone-input country-code="KR" value="01012345678" label="휴대폰 번호"></nds-phone-input>
<script>el.addEventListener("nds-phone-change", e => setPhone(e.detail.value));</script>
```

## examplesHtml.dont

```html
<!-- 다이얼 코드(+82) 를 country-code 로 — ISO 코드 사용 -->
<nds-phone-input country-code="+82"></nds-phone-input>
```
