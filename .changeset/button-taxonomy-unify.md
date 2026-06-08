---
"@nudge-design/tokens": minor
"@nudge-design/react": minor
"@nudge-design/html": minor
"@nudge-design/mcp": minor
---

⚠️ BREAKING — Button taxonomy 통일 (전 브랜드).

축 정리: `shape{default, pill}` × `variant{solid, soft, outlined}` × `color{primary, secondary, neutral}`.

- **`assistive` → `neutral` 하드 rename** (alias 없음): 토큰 슬롯(`buttonBg/text/border.assistive` × 전 브랜드 semantic), `cv.button` 멤버(`bgAssistive`→`bgNeutral` 등), CSS 변수 `--semantic-button-*-assistive-*` → `--semantic-button-*-neutral-*`, validator(html-validator·mockup-validator) 룰(`assistive-solid-cta`→`neutral-solid-cta`), MCP 가이드. → 외부 프로젝트에서 `<Button color="assistive">` / `--semantic-button-*-assistive-*` var 사용 시 **변경 필요**.
- **`outlined-sub` variant 제거** → `outlined` 로 흡수: react/html styleMap 의 3개 tone blocks·타입·`BUTTON_VARIANTS` 제거. 소비처(Trost AppBar·mockup-layout·stories) 는 `variant="outlined" color="secondary"` 로 마이그레이션(neutral 보더 유지). validator/guide/test enum 정리. → `<Button variant="outlined-sub">` 사용 시 **변경 필요**.
- `color` prop 이름은 **유지**(Badge/Chip 등과 공유 prop — Button 만 tone 으로 바꾸면 API 엇갈림). tone 개념은 값(primary/secondary/neutral)으로 표현.
- 시각 변화 없음(순수 rename/제거) — outlined-sub→outlined 흡수분만 weight medium→bold·text tone 미세 변화.
