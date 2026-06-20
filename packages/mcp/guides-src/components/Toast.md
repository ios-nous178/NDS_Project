---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=806-1277
---

## summary

**비차단형 단일 다크 일시 메시지** 전용 (저장 완료 / 복사됨 / 전송됨 등). 확인·클릭 없이 자동으로 사라지는(2~3초, 오류 4초까지) 가벼운 결과 피드백 — 다크 배경(#212121·0.92) + 흰 텍스트 하나의 스타일만 있다. **색 변형(success/error/warning/info)은 없다** — 심각한 오류·결정 요청은 Toast 대신 Modal/Alert. 위치가 곧 형태다: `position="top"` = PC·상단 중앙·**pill**·패딩 16/32·body2, `position="bottom"` = 모바일·하단·**rounded 24**·패딩 12/20·body3. **동시에 1개만 노출이 기본**(maxCount 기본 1 — 새 토스트가 기존을 즉시 대체); 스택이 필요하면 `maxCount` 를 올려 opt-in. 자동으로 사라지므로 **액션(되돌리기/다시시도)·닫기 버튼·프로젝트 카드(캐포비 흰 카드)는 두지 않는다** — 그런 알림은 Snackbar 를 사용한다. **캐시워크 포 비즈니스(cashwalk-biz/캐포비)는 알림을 Snackbar 만 사용한다 — Toast 를 쓰지 않는다(예외 없음).** 캐포비 화면의 `<nds-toast>` 는 validator 가 `project-banned-notification` error 로 차단한다. get_guide({ topic: 'component:Snackbar', project: 'cashwalk-biz' }).

## pitfalls

- **색 변형을 기대하지 말 것** — Toast 는 단일 다크 스타일이다. `variant` prop 은 없다(제거됨). 심각도 위계가 필요하면 Modal/Alert 또는 inline notice 패턴.
- **기본은 1개만 노출** — 연속 호출 시 기존 토스트는 즉시 사라진다. 동시에 여러 개를 쌓으려면 `maxCount` 를 명시적으로 올려라(가이드: 동시 1개 권장).
- 위치는 형태를 바꾼다 — `top` 은 PC pill, `bottom` 은 모바일 rounded 24. 디바이스 컨벤션(PC 상단 / 모바일 하단)을 따른다.
- duration 0 으로 영구 표시 금지 — 차단 의도면 Modal/Popup, 영구 알림이면 Banner.
- Toast 안에 input/form/액션 두지 말 것 — interactive 영역이면 Drawer/Modal, 액션·닫기가 필요하면 Snackbar.
- **캐포비(cashwalk-biz)에서는 Toast 자체를 쓰지 않는다 — Snackbar 만 사용**(순수 일시 메시지여도 예외 없음). validator `project-banned-notification` 룰이 `<nds-toast>` 를 error 로 막는다.
- **트로스트(Toast 가이드 806:1277)**: bg Black 0.92 · Top=pill(PC ≥1024 상단 중앙·safe-top 80) / Bottom=rounded 24(모바일 <1024 하단 중앙·safe-bottom 96·좌우 16). 본문 14 White 1줄 권장 · padding Bottom 12/20·Top 16/32 · shadow y8 blur24 18% · auto-dismiss 2~3s · z-index 1500+. 비가역형(액션 버튼 없음) — 액션 필요하면 Snackbar/Modal.

## examplesHtml.do

```html
<!-- 모바일: 하단 rounded 24 -->
<nds-toast message="저장되었습니다" position="bottom" duration="2500" open></nds-toast>
<!-- PC: 상단 pill -->
<nds-toast message="링크가 복사되었습니다" position="top" duration="2500" open></nds-toast>
```

## examplesHtml.dont

```html
<!-- 색 변형/액션이 필요 — Toast 가 아니라 Snackbar·Modal 사용 -->
<nds-toast open message="삭제됨" variant="error"></nds-toast><!-- variant 없음 · 되돌리기 불가 -->
```
