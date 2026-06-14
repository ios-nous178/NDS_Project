---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=171-9903
sizeMatrix:
  default: height 48 / padding 16·13 / wrapper gap 10 / radius 8
  field: height 48 / 같은 토큰, label-gap 8 — 폼-행 변형(라벨갭만 타이트). 캐포비 admin TextField 도 48(Figma 3082:846).
stateMatrix:
  default: "border #D8D8D8 / bg white / placeholder #999"
  typing: border var(--semantic-border-focus-default) (cv.border.focus) / text var(--semantic-text-strong-default) (cv.text.normal)
  error: "border #F13F00 (cv.error.main) / helper color same"
  disabled: "border #D8D8D8 / bg #FAFAFA (cv.bg.light) / text #999"
  complete: "border #D8D8D8 / bg white / helper variant=success(=primary blue)"
---

## summary

1px 보더, 흰 배경, 48px 높이. label/wrapper(field+addon)/helper 의 compound 구조 (Figma Library node 171:9903 기준).

## pitfalls

- 검색 변형이 필요하면 SearchInput을 사용. Input에 SearchIcon을 직접 박지 말 것.
- **매 키 입력마다 value 를 재포맷하지 말 것** — `input` 이벤트에서 천단위 콤마/단위를 붙여 `el.value` 를 되쓰면 nds-input 의 내부 controlled 상태와 충돌해 커서가 튀고 한 글자만 입력되거나 수정이 막힌다(회귀: 입찰단가/예산 콤마 라이브 포맷으로 '한 글자 이상 입력·수정 불가'). 금액·수량은 콤마·단위·clamp 가 내장된 **AmountInput(`<nds-amount-input>`)** 을 쓰고(검증룰 amount-as-text-input 이 일반 금액 input 자체를 막음), 굳이 일반 input 이면 포맷은 blur 시점이나 제출 시 파싱으로 미루고 입력 중에는 raw 값을 그대로 유지하라.
- label/helper 의 typography 는 caption-2(12/16) — body3(14/20) 로 키우지 말 것. Figma 명세보다 크면 폼이 산만해짐.
- complete=true 와 errorMessage 를 동시에 주지 말 것 — error 가 우선이지만 success 의도가 묻힘.
- errorMessage/successMessage/helperText 중 하나라도 있으면 helpers 배열은 무시됨. 단일/멀티 의도를 분리해서 사용.
- **helperText 와 errorMessage 동시 노출 금지** (★ 핵심 룰). DS 는 우선순위 error > success > helper 로 1 줄만 표시하도록 이미 강제하지만, 가이드/스토리/목업에서도 두 줄 동시 표시한 형태로 그리지 말 것. 헬퍼는 '비어 있을 때의 안내', 에러는 '검증 실패 후의 즉시 피드백' — 의미가 충돌하고 인지 부하가 커진다. 검증 실패 순간 helper 는 같은 자리에서 error 메시지로 교체되어야 함 (자리 점프 X, 두 줄 누적 X).
- **글자수 카운터(24/25)** 는 `maxlength` + `show-count`(React `maxLength` + `showCount`) — 우측에 자동 노출, 초과 시 빨간색. suffix 에 직접 텍스트로 박지 말 것. (Textarea 는 maxlength 만 주면 카운터 자동.)

## recommended

- 기본: <Input label='이메일' placeholder='example@nudge.kr' helperText='...' />
- 검증 실패: errorMessage 사용 — role='alert' 가 자동 부착됨
- 검증 성공: complete + successMessage — primary 컬러 헬퍼로 자동 전환
- 달력/검색 같은 아이콘 affordance: suffix prop (24x24)
- Multi-helper(비밀번호 규칙 체크리스트 등): helpers={[{ text, icon?, variant? }, ...]} — 또는 compound <Input.HelperGroup><Input.Helper>…</Input.Helper>…</Input.HelperGroup>
- 비밀번호: type='password' (HTML `type="password"`) → 우측 눈 아이콘 표시/숨김 토글이 **자동** 노출(auth/로그인 화면). 끄려면 passwordToggle={false} / `password-toggle="false"`. suffix 에 eye 아이콘을 손수 박지 말 것.

## accessibility

- label 은 InputLabel(자동 htmlFor 연결)을 통해 부착 — placeholder 로 대체 금지.
- errorMessage 가 있으면 helper 가 role='alert' 로 노출 — 스크린리더가 즉시 안내.
- aria-describedby 가 helperId 와 자동 연결됨 (helper 가 있을 때만).
- Clear 버튼은 aria-label='입력 삭제' 가 기본 제공 — readOnly/disabled 면 자동 숨김.

## interactivePattern

controlled/uncontrolled 모두 지원. clearable + onClear 로 값 초기화 콜백 부착. suffix slot 에 IconButton 등을 넣어도 됨 (단 onClick 핸들러 필수).

## examplesHtml.do

```html
<nds-input label="이메일" placeholder="example@nudge.kr" clearable></nds-input>
<!-- 글자수 카운터(24/25): maxlength + show-count (React: maxLength + showCount) -->
<nds-input label="캠페인 이름" maxlength="25" show-count></nds-input>
<!-- 비밀번호: type=password 면 눈 토글 자동 노출 -->
<nds-input label="비밀번호" type="password"></nds-input>
<script>el.addEventListener("input", e => setValue(e.target.value));</script>
```

## examplesHtml.dont

```html
<!-- value 와 default-value 를 동시에 설정 — controlled / uncontrolled 가 섞임 -->
<nds-input label="이메일" value="a@b" default-value="x@y"></nds-input>
<!-- 글자수 카운터를 suffix 텍스트로 직접 박지 말 것 — show-count 사용 -->
<nds-input label="이름" suffix="0/25"></nds-input>
<!-- 비밀번호 눈 아이콘을 suffix 로 손수 조립 금지 — type=password 가 자동 제공 -->
<nds-input label="비밀번호" type="password" suffix="👁"></nds-input>
<!-- raw <input> + className 으로 모양만 흉내 -->
<input class="nds-input" />
```
