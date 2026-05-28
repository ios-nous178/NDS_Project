---
"@nudge-design/html": patch
---

`<nds-tabs-trigger>` 클릭이 active-key 자동 토글되지 않던 결함 수정.

- 원인: 클릭 리스너를 내부 `<li>` 에 달아두었는데, 부모 `<nds-tabs>` / `<nds-tabs-list>` 가 mount 시 자식을 reparent 하면서 trigger 가 disconnect→reconnect 되어 리스너가 떼지고, 재mount 가드(`if (!this._li)`)에 의해 다시 안 달려 무반응.
- 수정: 리스너를 trigger host element 자체에 `connectedCallback` / `disconnectedCallback` 페어로 attach/detach. light DOM bubble 로 li 클릭이 그대로 잡히고, addEventListener 는 같은 (type, listener) 에 idempotent 이므로 reparent 후 reconnect 도 안전.
- 외부 호스트에서 직접 wiring 하던 우회 코드 제거 가능.
