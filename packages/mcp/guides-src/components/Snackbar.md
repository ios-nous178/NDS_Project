---
references:
  - label: CashwalkBiz Admin Snackbar Guide (구 ToastGuide)
    url: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3858-1005
    caption: Cashwalk for Business · 흰 카드 알림. state success/error/warning · 우측 상단 고정 · auto-dismiss 3–5s(Error 5s) · 단일 노출(교체) · status 칩 아이콘 + 메시지 + 닫기 X. (Figma 상 'Toast' 였으나 액션/닫기/카드 chrome 이라 DS 에선 Snackbar 로 구현.)
    brand: cashwalk-biz
matrixOverrides:
  cashwalk-biz:
    dimensions:
      states: success / error / warning 3종. Success = check 칩(그린) · Error = error 칩(레드) · Warning = caution 칩(옐로). status 칩 아이콘 24×24 가 좌측. default/info 도 컴포넌트는 지원하나 캐포비 admin 은 주로 success/error/warning 사용.
      anatomy: '① Status 칩 아이콘 24×24 (둥근 사각형 칩 + 흰 글리프, 색만 state 별) ② Message — Bold 16 / line-height 24, 한 줄 권장 ③ Close Icon(회색, 클릭 시 즉시 닫힘). 좌→우: 아이콘 · 메시지 · 닫기. **DS Snackbar(`<nds-snackbar-host brand="cashwalk-biz">` / `Snackbar.Provider brand="cashwalk-biz"`)가 칩 아이콘 + 흰 카드 chrome 을 직접 렌더** — 더 이상 호스트 커스텀 렌더 불필요.'
      container: BG/Surface/Default(흰 배경) · border subtle · radius 8 · padding 16 · shadow E1(0 2 6 / .12). data-brand='cashwalk-biz' cascade 가 variant 틴트 배경을 흰 카드로 덮는다(아이콘 색은 유지).
      position: viewport 기준 position:fixed · 우측 상단 고정. **`position='top-right'`**(우측 정렬 viewport)로 지원. base 의 top/bottom(가로 중앙)과 다름.
      behavior: 자동 dismiss 3–5초(Error 만 5s, duration 으로 지정) · 동시 노출 1개 — 새 알림이 기존을 교체. **단일 교체는 maxCount=1(Snackbar.Provider) / max-count='1'(nds-snackbar-host)**. base 기본 maxCount=3(multi-stack)과 다름.
      message: 한 문장 · 30자 이내 · 결과 중심('저장 완료' · '전송 실패'). Error 는 원인 + 다음 행동을 한 문장으로('네트워크 오류로 중단되었습니다. 다시 시도해 주세요') + action='다시 시도'. 두 줄 이상 긴 본문은 Alert/Modal.
      usage: Use = 저장·전송·삭제 등 액션 결과 알림 / 되돌리기·재시도 액션 / 닫기 가능. Don't = 결정·확인 요구(→Modal) / 긴·다단 정보(→Alert·Modal) / 여러 알림 누적(최대 1개) / 임의 위치 / state 의미 오용(성공에 warning).
      activationCondition: '`<html data-brand="cashwalk-biz">` 환경 admin 화면 기준. Provider(`brand="cashwalk-biz"`)가 칩 아이콘을, data-brand cascade 가 흰 카드 외형을 적용.'
---

## summary

**액션/닫기가 있는 카드형 알림**. 시맨틱 variant(info/success/warning/error) · 액션(되돌리기/다시시도) · 닫기 버튼 지원. 두 가지 모드: ① **인라인**(`<Snackbar>` / `<nds-snackbar>`) — 부모가 mount/unmount 로 표시 통제(자체 visibility 없음). ② **Provider**(`Snackbar.Provider` + `useSnackbar()` / `<nds-snackbar-host>`) — 포지셔닝·자동닫힘·단일교체·스택을 DS 가 관리(캐포비 admin 흰 카드 알림의 SSOT). Toast(인터랙션 없는 일시 메시지·자동 사라짐 전용)와 분리 — 액션·닫기가 있는 알림은 자동으로 사라지면 안 되므로 Snackbar 가 담당. brand 별 spec 변형은 get_guide({ topic:'component:Snackbar', brand:'<slug>' }).dimensions 참조.

## pitfalls

- 인터랙션 없는 단순 일시 메시지(저장됨/복사됨)는 Toast 가 더 적합 — 액션·닫기가 없으면 Snackbar 를 길게 띄우지 말 것.
- 액션이 두 개 이상 필요하면 Snackbar 대신 Modal/Popup을 검토.
- title 없이 description만 사용하지 말 것 — 시맨틱 의미가 무너짐.
- 인라인 `<Snackbar>` 는 자동으로 사라지지 않음(부모가 통제). 자동닫힘·우측상단·단일교체가 필요하면 `Snackbar.Provider`/`<nds-snackbar-host>` 사용.

## recommended

- 되돌리기: <Snackbar title='삭제됐어요' actionLabel='되돌리기' onAction={undo} />
- 에러 + 재시도: variant='error' actionLabel='다시 시도'
- 자동 사라짐 + 우측상단: <Snackbar.Provider position='top-right' maxCount={1}>…useSnackbar().snackbar('저장 완료',{variant:'success'})
- 캐포비 흰 카드: <Snackbar.Provider brand='cashwalk-biz' position='top-right' maxCount={1} duration={5000}>

## interactivePattern

두 모드 — 인라인 Snackbar 는 부모가 mount/unmount 로 통제, Provider(useSnackbar) 는 호출형으로 viewport·타이머·단일교체를 DS 가 관리.

## examplesHtml.do

```html
<nds-snackbar variant="success" snackbar-title="저장 완료"
  action-label="되돌리기" closable></nds-snackbar>
<script>bar.addEventListener("nds-snackbar-action", undo);</script>
<!-- 자동 사라짐·우측 상단·단일 교체가 필요하면 host 매니저: -->
<nds-snackbar-host position="top-right" max-count="1" brand="cashwalk-biz"></nds-snackbar-host>
```

## examplesHtml.dont

```html
<!-- 단순 확인 없는 일시 메시지에 위계 강한 Modal 사용 — 흐름을 끊음 -->
<nds-modal open title="저장 완료"></nds-modal>
```
