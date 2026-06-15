---
metrics:
  defaultColumns: 4
  allowedColumns: 2 · 3 · 4
  maxBadgePerCell: 1
  labelMaxChars: 4 (권장 — 줄바꿈 방지)
---

## summary

홈/마이페이지의 "빠른 액션" 아이콘 그리드는 **별도 컴포넌트가 아니라 Card + CSS 그리드 조합**으로 만든다. (옛 `QuickActionGrid` 컴포넌트는 단일 도메인 레이아웃 + Figma 가이드 노드 부재로 DS 편입 기준 미달 → 패턴으로 강등됐다. 같은 화면을 Card 셀의 그리드로 표현한다.) 한 셀 = 탭 가능한 카드(아이콘 + 라벨 + 선택적 배지), 그리드는 2·3·4칸. Card 본문 룰은 get_guide({ topic: 'component:Card' }), 배지는 get_guide({ topic: 'component:Badge' }) 와 함께 본다.

## rules

- **그리드 컨테이너**: `display:grid` + `grid-template-columns: repeat(N, 1fr)`. N = 2/3/4 (기본 4). 셀 간격은 `--semantic-gap-*` 토큰(raw px 지양). 8개를 4칸 2행처럼 행 수로 균형을 맞춘다.
- **셀 = 탭 가능한 Card**: 각 액션은 Card(또는 token 으로 스타일한 `button`) 1개 — 세로 정렬로 아이콘(상) + 라벨(하). 클릭 영역은 셀 전체. 카드 배경/보더/radius 는 Card 토큰 그대로(브랜드가 토큰으로 흡수).
- **아이콘**: `find_icon({ name })` 가 준 **inline SVG** 를 넣는다(이름 문자열·이모지 금지 — 이모지는 emoji-banned 위반). 아이콘 뒤 tint 배경이 필요하면 `--semantic-bg-*`/surface 토큰으로, raw hex 금지.
- **라벨**: 4글자 이하 권장(길면 줄바꿈). 색은 tone 토큰(`--semantic-text-*`)만.
- **배지**: 미읽음 카운트(숫자) 또는 짧은 라벨('N','NEW'). `Badge` 컴포넌트를 셀 우상단에 absolute 로 얹는다. 셀당 1개. 긴 텍스트 금지.
- **이벤트**: 셀 클릭 → 라우팅. 각 셀에 안정적인 key/data 속성을 둬 핸들러가 구분한다.

## avoid

- ❌ `QuickActionGrid`/`nds-quick-action-grid` 를 찾아 쓰기 — 제거됐다. Card 그리드로 조립한다.
- ❌ 5칸 배치(어색) — 3 또는 4칸으로. 8개는 4×2.
- ❌ 아이콘에 이름("home")·이모지 — inline SVG 여야 한다.
- ❌ 긴 라벨/긴 배지 텍스트, 셀당 배지 2개 이상.
- ❌ 간격·배경·radius 를 raw hex/px 로 — Card·gap 토큰만.

## readyMade.note

빠른 액션 4칸 그리드 — Card 셀의 CSS grid. 아이콘은 `find_icon({ name })` inline SVG, 셀 배경/보더/radius 는 Card 토큰, 간격은 `--semantic-gap-*`. raw hex/px 금지.

## readyMade.html

```html
<!-- 빠른 액션 4칸 그리드 — Card 셀의 grid. 아이콘 = find_icon inline SVG. -->
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:var(--semantic-gap-md)">
  <button class="qa-cell" data-key="log">
    <span class="qa-icon"><svg ...></svg></span>
    <span class="qa-label">기록</span>
  </button>
  <button class="qa-cell" data-key="counsel">
    <span class="qa-icon"><svg ...></svg></span>
    <span class="qa-label">상담</span>
    <span class="qa-badge"><!-- Badge: 3 --></span>
  </button>
  <!-- … home / content … -->
</div>
<!-- .qa-cell: Card 토큰(bg/border/radius) + 세로 flex. .qa-label 색 = --semantic-text-normal. raw hex 금지. -->
<script>
  grid.addEventListener("click", (e) => {
    const cell = e.target.closest(".qa-cell");
    if (cell) navigate(cell.dataset.key);
  });
</script>
```
