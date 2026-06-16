---
figmaNodeUrl: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5107-130
references:
  - label: Trost Chip — 필터칩 가이드 (TrostLibrary)
    url: https://www.figma.com/design/gC7CyAVloVvU896avolddQ/Trost-Library?node-id=5107-130
    caption: '트로스트 필터칩 가이드. default = color="neutral"(회색 보더 #E5E5E5 + 회색 텍스트 #606060), selected = 브랜드 노랑 강조(보더 #FFF42E + subtle bg #FFFDD9 + 오렌지 텍스트 #FF9D00), disabled = opacity 낮춤. height 30 · 좌우 padding 10. leading icon=icon prop · 삭제 X=onRemove. (색은 컴포넌트에 박지 않고 트로스트 토큰 override 로 슬롯 주입.)'
    brand: trost
usagePolicy:
  useFor:
    - "상태: 진행중, 완료, 마감"
    - "분류: 상담, 검사, 교육"
    - "짧은 속성: 신규, 추천, 필수"
  doNotUseFor:
    - 일반 안내문 강조
    - 섹션 제목 장식
    - 모든 카드에 반복되는 시각 장식
    - 긴 문장
    - CTA를 더 눈에 띄게 만들기 위한 보조 장식
  limits:
    maxLabelLength: 8
    maxPerCard: 2
    maxPerSection: 2
---

## summary

pill 형태 라벨. variant: fill/outlined/ghost. **React**: `<Chip label='...' />` (label prop 필수, children 금지). **HTML**: `<nds-chip>...</nds-chip>` (text content, label attribute 없음).

## pitfalls

- **React 한정** — `<Chip>{children}</Chip>` 으로 children 넣지 말 것. 반드시 `<Chip label='...' />`. 함정: HTML 예시(`<nds-chip>라벨</nds-chip>`)를 보고 React 에도 children 쓰면 API 어긋남.
- **HTML 한정** — `<nds-chip label='...' />` 처럼 label attribute 쓰지 말 것. nds-chip 은 label attribute 가 없고 children/text content 만 받음 (nds-chip.ts L189: `while (this.firstChild) label.appendChild(this.firstChild)`).
- **HTML 토글은 attribute 로** — `nds-chip` 은 `selected`/`color`/`variant` 등을 observedAttributes 로 감지해 자동 리렌더한다(NdsElement base 가 attributeChangedCallback→update). `setAttribute("selected","")` / `removeAttribute("selected")` 로 토글하면 색이 즉시 바뀐다 — **칩 노드를 통째로 교체하는 워크어라운드는 불필요**. 단 **property 대입(`el.selected = true`)은 무시됨**(setter 없음, attribute 만 읽음) → 이게 '클릭해도 색이 안 변한다'의 진짜 원인. 삭제는 `removable` + `chip-remove` 이벤트로 연결.
- **좌측 아이콘/체크/도트** — React 는 `icon` prop, HTML 은 `slot="icon"` 자식: `<nds-chip selected><svg slot="icon">…</svg>30대</nds-chip>` (slot 없는 자식은 전부 label 로 들어감). 아이콘은 `currentColor` 를 따르므로 텍스트색(=선택 시 채움 위 텍스트색)으로 렌더된다. brand-subtle 등 다른 선택 톤/텍스트색은 hex 말고 `--nds-chip-selected-background/text/border` override(예: 캐포비는 노랑 위 검정 텍스트로 `--nds-chip-selected-text` override).
- **트로스트 필터칩** — `color="neutral"` 기본(회색: 보더 #E5E5E5 + 텍스트 #606060), `selected` 시 브랜드 노랑 강조(보더 #FFF42E + subtle bg #FFFDD9 + 오렌지 텍스트 #FF9D00, outlined-selected 룩 — 구 다크 채움 #333 폐기). 높이 30 · 좌우 padding 10. leading icon=`icon` prop, 삭제 X=`onRemove`, 선택 토글=`selected` prop. 색은 컴포넌트에 박지 말고 트로스트 토큰 override 가 슬롯에 주입한다(matrixOverrides.trost 참조).
- Chip은 상태/분류/짧은 속성 표시용이다. 새 섹션을 강조하거나 일반 안내문을 꾸미는 장식으로 쓰지 말 것.
- 모든 카드/섹션 제목 앞에 Chip을 붙이면 위계가 무너진다. 카드당 최대 1-2개, 섹션당 최대 2개 수준으로 제한.
- 긴 문장이나 CTA 보조 문구를 Chip에 넣지 말 것. 8자 안팎의 짧은 라벨만 자연스럽다.
- 표준 variant에 없는 톤(예: caution, success)이 필요해도 raw <span>/<div>로 대체 금지. style prop으로 background/color/font-weight를 토큰 변수로 override + icon prop으로 좌측 도트 주입이 정공법.

## recommended

- 주의 톤: <Chip label='주의 필요' variant='ghost' size='sm' icon={<span style={{width:6,height:6,borderRadius:9999,background:'var(--semantic-caution-main)'}}/>} style={{background:'var(--semantic-caution-bg)',color:'var(--semantic-caution-text)',fontWeight:600}} />
- 성공/에러도 같은 패턴으로 토큰 var()만 교체

## examplesHtml.do

```html
<nds-chip variant="outlined" color="brand" interactive>전체</nds-chip>
<nds-chip variant="ghost" color="caution" size="sm" removable>주의 필요</nds-chip>
<!-- 선택형(SelectChip): 좌측 ✓ 체크는 slot="icon" 자식으로. 색은 currentColor(텍스트색)를 따름 -->
<nds-chip selected interactive><svg slot="icon" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>30대</nds-chip>
```

## examplesHtml.dont

```html
<!-- disabled 와 removable 동시 사용 — 누가 X 버튼을 누를 수 있는지 모호 -->
<nds-chip disabled removable>태그</nds-chip>
<!-- interactive 없이 클릭 핸들러만 — 키보드 포커스가 안 잡힘 -->
<nds-chip onclick="…">필터</nds-chip>
```
