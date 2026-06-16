---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=171-9899
---

## summary

단순 확인/거부(취소·삭제·종료) 1-액션 다이얼로그. 본문이 긴 경우엔 Modal, 비차단 알림은 Snackbar. 버튼 배치는 actionsLayout('split'=2버튼 50/50·1버튼 세로 스택 | 'end'=우측 hug)으로 제어하고, 생략 시 브랜드 기본(캐포비=end, 그 외=split)이 강제된다(react=actionsLayout prop, html=actions-layout 속성). 색/pill 모양은 브랜드 토큰이 별도 결정.

## pitfalls

- Popup 본문에 form / 멀티 입력을 두지 말 것 — Modal 이 맞음.
- destructive 액션의 confirm-text 가 '확인' 처럼 일반 — 'X 삭제하기' / 'X 종료' 처럼 결과 명시.
- show-cancel 끄고 confirm 만 — 사용자에게 거부권을 주지 않음 (info popup 외에는 비권장).
- 버튼 배치를 직접 flex/justify 로 덮어쓰지 말 것 — actionsLayout='split'|'end' 사용(브랜드 기본은 자동).

## examplesHtml.do

```html
<nds-popup open title="신청을 취소할까요?" description="입력한 내용은 저장되지 않아요"
  confirm-text="신청 취소하기" cancel-text="계속 작성" show-cancel></nds-popup>
<script>el.addEventListener("popup-confirm", cancel); el.addEventListener("popup-cancel", () => el.removeAttribute("open"));</script>
```

## examplesHtml.dont

```html
<!-- show-cancel 없음 + confirm 일반 — 사용자 거부 불가 -->
<nds-popup open title="저장됨" confirm-text="확인"></nds-popup>
```
