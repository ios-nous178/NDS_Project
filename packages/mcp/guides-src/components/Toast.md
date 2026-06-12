---
{}
---

## summary

**인터랙션 없는 일시 메시지** 전용 (저장 완료 / 복사됨 / 네트워크 에러 등). 확인·클릭 없이 자동으로 사라지는 가벼운 결과 피드백 — multi-stack 가능(maxCount). 자동으로 사라지므로 **액션(되돌리기/다시시도)이나 닫기 버튼·브랜드 카드(캐포비 흰 카드)는 두지 않는다** — 그런 알림은 Snackbar 를 사용한다. (액션이 사라지는 토스트에 붙으면 사용자가 누를 새가 없다.) **캐시워크 포 비즈니스(cashwalk-biz/캐포비)는 알림을 Snackbar 만 사용한다 — Toast 를 쓰지 않는다(예외 없음).** 흰 카드 chrome·우측 상단 고정·상태 칩 아이콘·닫기 X 가 캐포비 알림 SSOT. 캐포비 화면의 `<nds-toast>` 는 validator 가 `brand-banned-notification` error 로 차단한다. get_guide({ topic: 'component:Snackbar', brand: 'cashwalk-biz' }).

## pitfalls

- duration 0 으로 영구 표시 — 차단 의도면 Modal/Popup, 영구 알림이면 Banner.
- 변형(default/success/error/warning) 없이 모두 default — 시각 위계가 사라짐.
- Toast 안에 input/form 두지 말 것 — interactive 영역이면 Drawer/Modal.
- **액션(되돌리기/다시시도)·닫기 버튼이 필요하면 Toast 가 아니라 Snackbar** — Toast 는 action API 가 없다(자동 사라짐 전용). 캐포비 admin 흰 카드 알림도 Snackbar(get_guide component:Snackbar, brand:'cashwalk-biz')로 이관됐다.
- **캐포비(cashwalk-biz)에서는 Toast 자체를 쓰지 않는다 — Snackbar 만 사용**(순수 일시 메시지여도 예외 없음). validator `brand-banned-notification` 룰이 `<nds-toast>` 를 error 로 막는다.

## examplesHtml.do

```html
<nds-toast message="저장되었습니다" variant="success" position="bottom" duration="2500" open></nds-toast>
<script>el.addEventListener("toast-close", () => el.removeAttribute("open"));</script>
```

## examplesHtml.dont

```html
<!-- 액션이 필요 — Toast 가 아니라 Snackbar 사용 -->
<nds-toast open message="삭제됨" variant="default"></nds-toast><!-- 되돌리기 버튼 불가 -->
```
