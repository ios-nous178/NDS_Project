---
standalone: false
composeWith: [Input, Button]
---

## summary

전화번호 인증 / 인증코드 입력처럼 '입력 1개 (+ 액션 버튼) (+타이머)' 한 줄 패턴 전용 helper. **action 은 옵션** — 생략하면 코드 입력 + 우측 타이머만(인라인 버튼 없는 레이아웃, 예: 캐포비 본인인증의 별도 full-width 재전송 버튼 + 타이머만 있는 코드 입력. pattern:cashwalk-biz-verification). React 는 flat API 하나만 — 구 Compound API(.Root/.Field/.Action…) 는 제거됨.

## pitfalls

- **라벨이 필요하면 `label`(html: label 속성 / react: label prop)을 쓴다 — 라벨을 손으로 버튼과 같은 줄에 넣지 말 것.** '휴대폰 번호' 같은 필드 라벨이 필요한 인증 row 에서 라벨을 별도 마크업으로 버튼 옆/위에 욱여넣으면 버튼이 라벨 높이에 떠 입력칸과 어긋난다(회귀). label 을 넘기면 라벨은 한 줄 위, 입력+버튼은 인라인으로 컴포넌트가 정렬한다.
- **전송/재전송 토글** — 휴대폰 인증에서 [인증번호 받기] 버튼은 전송 후 [재전송]으로 라벨을 토글한다(상태는 호출부 useState). 표준 라벨은 '재전송'(SMS 재발송) — '재시도'는 실패 재시도 뉘앙스라 인증 발송엔 '재전송'을 쓴다.
- 범용 폼 레이아웃 용도 아님 — 여러 필드/버튼은 Input + Button 직접 조합. 이 컴포넌트는 인증 row 1줄에만.
- Action 이 핵심 폼 동작(검색 / 제출) 이면 row 안이 아니라 별도 CTA 영역.
- Action 라벨이 길어 row 가 줄바꿈 — 80자 미만 / 1-2 단어로 유지.
- React 에서 더는 .Root/.Row/.Field/.Timer/.Action/.Helper 합성 불가 — field/action/timer/helperText prop 으로 전달.
- 타이머는 필드 우측 안에 떠도, **필드가 자동으로 우측 공간을 예약**(data-has-timer)하므로 입력값/placeholder 가 타이머 밑으로 안 파고든다 — 필드 input 에 수동 paddingRight 를 넣지 말 것(구 회귀 워크어라운드). 좁은 폭이 부족하면 `--nds-far-timer-reserve` 로 조정.
- 필드 **안**에 들어가는 타이머는 값만(mm:ss) 두고 '남은 시간' 라벨은 생략한다 — helper-text 가 맥락을 주고, 라벨을 넣으면 좁은 필드가 더 빡빡해진다. (CountdownTimer 에 label prop 을 안 주면 값만 렌더.)
- action 에 DS Button(<Button>/<nds-button>)을 넣으면 그 버튼의 color/variant 가 그대로 적용된다 — 캐포비 검정 확인 버튼은 color="neutral" (secondary 아님 — 캐포비는 secondary tone 이 Figma 가이드에 없어 Button 이 denylist+콘솔 경고로 막는다. 검정 #111 = neutral/solid, 회색 = neutral/soft). 메인 제출 CTA 만 노랑 color="primary". (FieldActionRow 는 raw <button> 에만 brand 톤을 강제하므로, color 가 안 먹던 '노란 버튼' 회귀는 해소됨.) actionTone prop 은 raw <button> 전용.

## examplesHtml.do

```html
<!-- 라벨이 필요한 인증 row(예: 휴대폰 번호 + [인증번호 받기])는 label 속성을 쓴다 —
     라벨은 한 줄 위, 입력+버튼은 인라인으로 컴포넌트가 정렬한다. 전송 후 버튼은 [재전송]으로 토글. -->
<nds-field-action-row label="휴대폰 번호" helper-text="'-' 없이 숫자만 입력해주세요">
  <nds-input slot="field" placeholder="01012345678"></nds-input>
  <nds-button slot="action" color="neutral" variant="outlined">인증번호 받기</nds-button>
</nds-field-action-row>

<!-- action 버튼 색은 nds-button 의 color 가 그대로 산다 — 캐포비 검정 확인/재전송은 color="neutral"
     (캐포비는 secondary tone 이 Figma 가이드에 없어 denylist+콘솔 경고. 검정/회색 CTA = neutral).
     (FieldActionRow 는 raw <button> 에만 brand 톤을 강제하고 DS 버튼은 건드리지 않음.) -->
<nds-field-action-row helper-text="이메일로 인증 코드를 보냈어요">
  <nds-input slot="field" label="인증 코드"></nds-input>
  <nds-button slot="action" color="neutral">재전송</nds-button>
</nds-field-action-row>
```

## examplesHtml.dont

```html
<!-- slot 미지정 — 위치/스타일이 적용 안 됨 -->
<nds-field-action-row>
  <nds-input></nds-input>
  <nds-button>재전송</nds-button>
</nds-field-action-row>
```
