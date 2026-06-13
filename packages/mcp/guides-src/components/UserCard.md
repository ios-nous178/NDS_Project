---
{}
---

## summary

**⚠ Deprecated — Card 합성으로 대체하세요.** 순수 슬롯 배치라 NudgeEAP Card 가이드의 "프로필 카드" 조합(`Card.Avatar` + `Card.Title` + `Card.Subtitle`(handle) + `Card.Description`(bio) + `Card.Metadata` + `Card.Cta`)으로 동일하게 표현됩니다. 다음 major 에서 제거 예정. 범용 프로필 미니카드(row/stacked, verified, action 슬롯) 기능 자체는 유지됩니다.

## pitfalls

- onClick과 action 동시 사용 가능 — action 클릭은 stopPropagation됨 (의도).
- bio는 자동 2줄 클램프. 디테일은 별도 화면으로.
- EAP 상담사 전용은 CounselorCard. UserCard는 일반 사용자/멤버용.

## recommended

- 팔로우 리스트: row + 작은 action 버튼
- 프로필 모달: stacked + bio + 큰 action

## examplesHtml.do

```html
<nds-user-card name="이정민" handle="@jeongmin" bio="디자이너" verified layout="row" clickable>
  <img slot="avatar" src="/u.jpg" alt="" />
  <nds-button slot="action" color="primary" variant="outlined">팔로우</nds-button>
</nds-user-card>
```

## examplesHtml.dont

```html
<!-- avatar / action 을 slot 없이 children 으로 — 레이아웃이 깨짐 -->
<nds-user-card name="A"><img src="/u.jpg"><button>팔로우</button></nds-user-card>
```
