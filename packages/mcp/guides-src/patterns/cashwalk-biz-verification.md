---
{}
---

## summary

캐시워크 포 비즈니스(캐포비) **본인 인증(휴대폰 SMS) 폼**의 정규 조립 패턴. DS 컴포넌트가 아니라 조립 레시피다 — 이름·휴대폰번호·인증번호 받기 → (코드 전송 후) 인증번호 입력 + 남은시간 타이머 → 확정은 **하단 CTA**. 별도 "인증하기" 버튼을 두지 않는다(확정=하단 [다음]/[계정 생성], 자동검증=`code-complete`). 조각은 모두 기존 컴포넌트: `nds-phone-input` · `nds-verification-code-input` · `nds-button`(전송/재전송) · `nds-notice-alert`(에러) + 앱이 합성하는 인라인 타이머. 코드 입력은 **반드시 `nds-verification-code-input`** 을 쓴다(일반 `nds-input` 으로 흉내내지 말 것). 인증 성공 모달의 체크 아이콘은 **DS 아이콘/`nds-notice-alert variant="success"`/`nds-result-state status="success"`** 로 — hand-roll SVG 금지(아래 ⑥).

## rules

- ① 휴대폰번호는 `nds-phone-input` (MUST) — `type="tel"` 인 raw `nds-input` 으로 흉내내지 말 것. 국가코드+포맷이 DS 에 들어있다.
- ② 인증코드 입력은 `nds-verification-code-input` (MUST) — 일반 `nds-input` 금지. 단일 박스 + 붙여넣기/`one-time-code` 자동완성 + `code-complete`(length 충족 시) 이벤트를 자연 지원한다. 자리별 6칸 박스도 만들지 말 것(component:VerificationCodeInput).
- ③ 전송/재전송은 **full-width 검정 버튼 하나**(MUST) — `<nds-button color="neutral" full-width>`. "인증번호 받기" 로 시작해 코드 전송 후 라벨을 "인증번호 재전송" 으로 토글한다. 캐포비 검정 CTA 는 `color="neutral"`(secondary 아님 — Figma 미정의).
  - 라벨 토글은 `btn.textContent = "재전송"` 또는 `setAttribute` 로 해도 안전하다(nds-button 이 라벨을 자동 복원). 단 **재전송을 별도 텍스트/링크로 흩뿌리지 말 것** — 한 버튼의 상태 전환이다.
- ④ 남은시간 타이머는 **앱이 합성하는 인라인 요소**(MUST, DS 컴포넌트 아님) — 코드 입력 우측에 겹쳐 배치하거나(레시피A) 코드 입력 옆에 둔다. 색은 프로젝트 강조색(캐포비 `#FD9B02` = `--semantic-text-accent` 계열, raw hex 대신 토큰). 앱이 `setInterval` 로 `mm:ss` 갱신, 만료 시 ③ 버튼을 "재전송" 활성.
- ⑤ 에러 메시지는 `nds-notice-alert variant="error"` + **비어있지 않은 message**(MUST) — `message=""` 인 alert 를 노출하면 아이콘만 든 빈 박스가 된다. 에러가 없을 땐 **`hidden` 속성으로 토글**(보일 때 message 를 채운다). `nds-notice-alert` 는 `[hidden]` 을 존중한다.
- ⑥ 확정은 하단 CTA (MUST) — 별도 "인증하기" 버튼을 만들지 않는다. `code-complete` 에서 자동검증하거나 하단 [다음]/[계정 생성](primary, multi-step 이면 cta-group)에서 일괄 검증. 검증 실패는 ⑤ 에러, 성공은 다음 단계/모달.
- ⑦ 성공 표시 아이콘은 DS 로 (MUST) — 완료 모달/화면의 체크는 `nds-notice-alert variant="success"`(원+흰 체크) · `nds-result-state status="success"` · 또는 `find_icon` 의 `CashwalkBizCheckCircleOnIcon`. **원과 체크를 같은 `fill="currentColor"` 로 둔 hand-roll SVG 금지** — 체크가 원과 같은 색이라 안 보인다(초록-온-초록). 체크는 흰색 knockout 이거나 stroke 여야 한다.
- ⑧ 다단계(온보딩) 안이면 pattern:multi-step-form 의 상태계약을 따른다 — 인증은 비동기 게이트(⑤ of multi-step-form), 응답 전 낙관적 전진 금지.

## avoid

- 인증코드를 일반 `nds-input`(또는 raw `<input>` 6칸)으로 — ② 위반. `nds-verification-code-input` 사용.
- 재전송을 버튼이 아닌 **맨 텍스트/라벨로** 표기 — 한 버튼(③)의 상태 전환이어야 한다.
- "인증하기" 같은 별도 확정 버튼 추가 — 확정은 하단 CTA(⑥). 화면에 primary CTA 가 2개가 되며 캐포비 컨벤션(화면당 primary 1개) 위반.
- `nds-notice-alert message="" hidden` 을 띄워 **아이콘만 든 빈 박스** 노출 — ⑤ 위반(보일 땐 message 를 채우고, 없을 땐 hidden).
- 완료 모달 체크를 **원·체크 같은 색의 hand-roll SVG** 로 — ⑦ 위반(invisible). DS 성공 아이콘 사용.
- 타이머를 DS 컴포넌트로 착각하거나 색을 raw hex 로 — 앱 합성 인라인 + 토큰(④).
- 휴대폰번호를 raw `nds-input type=tel` 로 — ① 위반.

## readyMade.note

캐포비 본인인증 폼의 정규 골격(코드 전송 전 → 후 두 상태). 타이머 갱신·코드 검증·단계 전환은 앱이 소유한다. 색은 토큰 — hex 직접 지정 금지. 다단계 온보딩 안이면 풋터는 pattern:multi-step-form 의 cta-group 으로.

## readyMade.html

```html
<!-- 캐포비 본인인증 — 조립 패턴. 전송/검증/타이머는 앱 state. -->
<div style="display:flex; flex-direction:column; gap:16px; max-width:480px">
  <nds-input id="v-name" label="이름" full-width placeholder="이름을 입력해 주세요"></nds-input>
  <nds-phone-input id="v-phone" country-code="KR" label="휴대폰번호"></nds-phone-input>

  <!-- ③ 전송/재전송: full-width 검정 버튼 하나. 전송 후 라벨을 "인증번호 재전송" 으로 토글. -->
  <nds-button id="v-send" color="neutral" full-width>인증번호 받기</nds-button>

  <!-- 코드 전송 후 노출(hidden 토글). 에러 없을 땐 notice-alert 도 hidden. -->
  <div id="v-code-block" hidden style="display:flex; flex-direction:column; gap:8px">
    <div style="position:relative">
      <!-- ② 코드 입력은 nds-verification-code-input -->
      <nds-verification-code-input id="v-code" length="6" auto-focus></nds-verification-code-input>
      <!-- ④ 남은시간 타이머 = 앱 합성 인라인 요소(프로젝트 강조색·토큰) -->
      <span id="v-timer"
        style="position:absolute; right:16px; top:50%; transform:translateY(-50%);
               color:var(--semantic-text-accent, #FD9B02); font-variant-numeric:tabular-nums;">3:00</span>
    </div>
    <!-- ⑤ 에러: variant=error + 비어있지 않은 message. 없을 땐 hidden. -->
    <nds-notice-alert id="v-err" variant="error" message="" hidden></nds-notice-alert>
  </div>
</div>
<!-- ⑥ 확정은 하단 CTA(primary). 별도 "인증하기" 버튼 없음. -->
<nds-button id="v-next" color="primary" full-width>다음</nds-button>

<script>
  const send = document.querySelector("#v-send");
  const codeBlock = document.querySelector("#v-code-block");
  const err = document.querySelector("#v-err");
  send.addEventListener("click", () => {
    codeBlock.hidden = false;
    send.textContent = "인증번호 재전송"; // nds-button 이 라벨 구조 자동 복원
    startTimer();                          // 앱: setInterval 로 #v-timer mm:ss 갱신
  });
  // 자동검증(code-complete) 또는 하단 CTA 에서 일괄 검증
  document.querySelector("#v-code").addEventListener("code-complete", (e) => verify(e.detail.value));
  function showError(msg) { err.setAttribute("message", msg); err.hidden = false; }
  function clearError() { err.hidden = true; }
</script>
```
