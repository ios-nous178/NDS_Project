---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/%F0%9F%93%9A-%EB%84%9B%EC%A7%80EAP---Library?node-id=1751-20
---

## summary

Dim — Modal·BottomSheet·BottomPopup 등 오버레이의 백드롭(배경 차단 레이어). 화면 전체를 검정 alpha 로 덮어 뒤쪽 콘텐츠와의 위계를 만들고 포커스를 오버레이로 모은다. 강도 3단계 — `type="subtle"`(α0.2·가벼운 분리) · `type="default"`(α0.4·BG/Overlay 토큰·표준) · `type="strong"`(α0.7·완전 차단). **표현(배경 차단)만 책임지는 primitive** — 스크롤 잠금·포커스 트랩·ESC·z-index 스택은 오버레이 컨테이너가 담당한다.

## pitfalls

- **강도는 오버레이 무게에 맞춘다.** Modal·표준 BottomSheet = `default`. Light BottomSheet(이벤트·리워드) = `subtle`. 풀스크린 미디어 뷰어·중요 결정·보안 입력 = `strong`. Snackbar/Toast 는 인라인 알림이라 백드롭 자체가 불필요 — Dim 을 쓰지 말 것.
- **Default 만 프로젝트별 테마.** `default` 는 `--semantic-bg-overlay` 시멘틱 토큰(트로스트 α0.6·런마일 α0.5 등 프로젝트별·다크모드 자동). `subtle`/`strong` 은 범용 검정(α0.2/0.7) — 프로젝트 무관.
- **백드롭 색은 검정 alpha 만.** 채도 있는 색(브랜드 컬러)을 백드롭에 쓰지 말 것. 항상 풀스크린(`position: fixed; inset: 0`) — 부분 영역에만 Dim 을 적용하면 시각적 혼란.
- **클릭 닫기는 탈출구.** `onClose`(react) / `nds-dim-close` 이벤트(html)로 백드롭 클릭 닫기를 제공한다. 단 **강제 결정 화면**(Modal=필수 결정·BottomSheet Upclose)에선 `onClose` 를 넘기지 않아 닫기를 막는다. 백드롭 클릭이 닫기·무동작 외 다른 액션을 트리거하지 않게 한다.
- **다중 스택 시 Dim 한 장만.** 오버레이가 여러 겹 쌓이면 가장 위 레이어의 Dim 만 표시(색 중첩으로 0.8↑ 진해짐 방지). 오버레이가 닫혔는데 Dim 만 남기지 말 것.
- **혼동 주의 — Modal/BottomSheet/Popup 은 자체 백드롭을 이미 포함**한다. 그 위에 Dim 을 또 깔지 말 것. Dim 은 백드롭이 없는 커스텀 풀스크린 오버레이를 직접 조립할 때 쓰는 primitive 다.

## examplesHtml.do

```html
<!-- 커스텀 풀스크린 오버레이의 표준 백드롭 (클릭 시 nds-dim-close 디스패치) -->
<nds-dim type="default"></nds-dim>

<!-- 풀스크린 이미지/영상 뷰어 — 뒤쪽 완전 차단 -->
<nds-dim type="strong"></nds-dim>
```

## examplesHtml.dont

```html
<!-- ① 채도 있는 브랜드 색 백드롭 금지 — 검정 alpha 만 -->
<div style="position:fixed; inset:0; background:rgba(43,150,237,0.4)"></div>

<!-- ② Modal 은 이미 백드롭 포함 — Dim 중복 금지 -->
<nds-dim type="default"></nds-dim>
<nds-modal open>...</nds-modal>

<!-- ③ 부분 영역 Dim 금지 — 항상 풀스크린 -->
<nds-dim type="default" style="position:absolute; width:200px; height:100px"></nds-dim>
```

## accessibility

- 백드롭은 장식 레이어 — 이너 요소에 `aria-hidden="true"` 가 기본 적용돼 스크린리더가 백드롭을 읽지 않는다. 의미 전달은 위에 얹히는 오버레이 콘텐츠(`role="dialog"` 등)가 담당.
- 키보드 닫기(ESC)·포커스 트랩은 Dim 이 아니라 오버레이 컨테이너의 책임. Dim 의 클릭 닫기는 마우스 보조 수단이다.
