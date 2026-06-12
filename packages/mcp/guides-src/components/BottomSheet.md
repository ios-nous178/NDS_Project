---
{}
---

## summary

모바일에서 화면 하단에서 올라오는 시트. 옵션 선택 / 짧은 작업에 적합. 데스크탑에선 Drawer 가 자연스러움. 공유 시트는 이 컴포넌트로 4칸 그리드 + 링크 복사 레시피로 조립한다.

## pitfalls

- BottomSheet 안에 깊은 nested form / 멀티 탭 — 사용자가 컨텍스트를 잃음. 별도 화면 또는 Modal 사용.
- 공유 기능은 별도 ShareSheet 컴포넌트보다 BottomSheet + 버튼 그리드 + 링크 복사 레시피로 조립.
- open 상태에서 뒤 페이지 scroll 잠그지 않으면 body scroll 충돌.
- 트리거 버튼 없이 자동 open — 사용자 의도 없는 시트는 다크 패턴.

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
