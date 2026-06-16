---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/?node-id=5258-128
sizeMatrix:
  radius (base): var(--nds-bottom-sheet-radius, radius.lg = 12) — 상단 좌우만
  radius (Trost): 20 (브랜드 토큰이 --nds-bottom-sheet-radius:20px emit)
  handleWidth (base): var(--nds-bottom-sheet-handle-width, 36) × 4 height
  handleWidth (Trost): 40 (브랜드 토큰이 --nds-bottom-sheet-handle-width:40px emit)
  handleColor: cv.borderRole.normal (브랜드 불변)
  shadow: var(--nds-bottom-sheet-shadow, 0 -4px 12px rgba(0,0,0,.1)) — 위 방향, default 불변
  backdrop: var(--nds-bottom-sheet-backdrop, rgba(0,0,0,.5)) — default 불변
  maxWidth: var(--nds-bottom-sheet-max-width, 664)
  maxHeight: var(--nds-bottom-sheet-max-height, 85vh)
  safeArea: footer/마지막 body 에 env(safe-area-inset-bottom) 가산 (iOS 홈 인디케이터)
---

## summary

모바일에서 화면 하단에서 올라오는 시트. 옵션 선택 / 짧은 작업에 적합. 데스크탑에선 Drawer 가 자연스러움. 공유 시트는 이 컴포넌트로 4칸 그리드 + 링크 복사 레시피로 조립한다. 시각 토큰은 --nds-bottom-sheet-* 슬롯(radius·handle-width·shadow·backdrop)으로 노출돼 브랜드 토큰이 값만 덮는다 — Trost 는 radius 20·handle 40 을 emit(컴포넌트는 브랜드를 모름, base 는 12/36 불변). Share/Info/List 는 별도 prop·variant 가 아니라 BottomSheet 본체 + DS 토큰으로 조립하는 컴포지션 레시피다.

## pitfalls

- BottomSheet 안에 깊은 nested form / 멀티 탭 — 사용자가 컨텍스트를 잃음. 별도 화면 또는 Modal 사용.
- 공유 기능은 별도 ShareSheet 컴포넌트보다 BottomSheet + 버튼 그리드 + 링크 복사 레시피로 조립.
- open 상태에서 뒤 페이지 scroll 잠그지 않으면 body scroll 충돌.
- 트리거 버튼 없이 자동 open — 사용자 의도 없는 시트는 다크 패턴.
- Share/Info/List 를 위해 variant prop 을 찾지 말 것 — 존재하지 않는다. 아래 recommended 의 레시피를 토큰으로 조립한다.
- 색은 raw hex 로 박지 말고 Point 토큰을 쓴다. 단 카카오(#FEE500)·네이버(#03C75A) 같은 SNS 브랜드 컬러는 그들 고유색이라 raw 유지(DS 토큰 아님).

## recommended

- Share 레시피 — title="공유하기" + 4칸(repeat(4,1fr)) 아이콘 그리드 + 하단 링크 복사 행. 원형 통화/콜 CTA 는 40×40 background cv.surface.pointSubtle + 아이콘 cv.iconRole.point. SNS 버튼 배경만 브랜드 raw(kakao #FEE500 / naver #03C75A).
- Info 레시피 — title + body 안에 강조 박스(background cv.surface.pointSurface)로 핵심 안내를 띄우고, 푸터에 단일 확인 CTA. 강조 박스 텍스트는 cv.textRole.point / pointStrong.
- List 레시피 — title="…선택" closable + body 에 세로 옵션 리스트(각 행은 구분선 borderRole.subtle, 선택 행은 cv.textRole.point + weight 600). 단일/단답 선택에 사용, 다중 선택·복잡 폼은 Modal.
- Primary CTA(레시피 공통) — 푸터 주 버튼은 background cv.surface.point · text cv.textRole.inverse · radius 8. Button 컴포넌트를 그대로 쓰면 브랜드 토큰이 알아서 따라온다.
- Trost 정합 — radius 20 / handle 40 은 브랜드 토큰(--nds-bottom-sheet-radius·--nds-bottom-sheet-handle-width)이 자동 emit. 컴포넌트/스토리에서 값을 하드코딩하지 말 것.
- 안전영역 — 푸터(또는 푸터 없을 때 마지막 body)는 env(safe-area-inset-bottom) 가 자동 가산돼 iOS 홈 인디케이터와 겹치지 않는다. 추가 padding 불필요.

## examplesHtml.do

```html
<nds-bottom-sheet open sheet-title="옵션 선택">
  <div slot="body">옵션 본문…</div>
  <div slot="footer"><nds-button color="primary">확인</nds-button></div>
</nds-bottom-sheet>
<script>el.addEventListener("nds-bottom-sheet-close", () => el.removeAttribute("open"));</script>
```

## examplesHtml.dont

```html
<!-- nds-bottom-sheet-close 미처리 — overlay/ESC 가 닫지 못함 -->
<nds-bottom-sheet open sheet-title="선택"></nds-bottom-sheet>
```
