---
{}
---

## summary

측면(left/right) 슬라이드 패널. 모달보다 가벼운 컨텍스트(필터, 보조 정보, 빠른 작업)에 적합. 모달과 동시에 열지 말 것.

## pitfalls

- open attribute 만 토글하고 nds-drawer-close 이벤트를 처리 안 함 — overlay 클릭 / ESC 가 끄지 못함.
- Drawer 안에서 또 Drawer / Modal 을 열지 말 것 (overlay z-index 충돌).
- size='lg' 로 viewport 의 80% 이상을 덮으면 사실상 Modal — Modal 사용을 검토.

## examplesHtml.do

```html
<nds-drawer side="right" size="md" drawer-title="필터">
  <p>필터 UI…</p>
  <div slot="footer"><nds-button color="primary">적용</nds-button></div>
</nds-drawer>
<script>el.addEventListener("nds-drawer-close", () => el.removeAttribute("open"));</script>
```

## examplesHtml.dont

```html
<!-- close 이벤트 처리 없음 — overlay 클릭이 닫지 못함 -->
<nds-drawer open side="right" size="md">필터…</nds-drawer>
```
