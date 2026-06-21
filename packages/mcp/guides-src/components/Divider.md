---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/%F0%9F%93%9A-%EB%84%9B%EC%A7%80EAP---Library?node-id=1722-20
sizeMatrix:
  type=line: 1px (Border 라인) — orientation horizontal/vertical, tone subtle/normal/strong
  type=block: 8px (BG/Section 청크) — 가로 전용, 섹션 사이
  tone=subtle: borderRole.subtle (카드/모달 내부)
  tone=normal: borderRole.normal (기본·default)
  tone=strong: borderRole.strong (강조)
---

## summary

콘텐츠 분리 보조요소. line(1px Border)=리스트/카드 내부, block(8px BG/Section)=섹션 사이. type 기본 line, tone 기본 normal — 임의 두께·브랜드/Status 색 금지.

## pitfalls

- **type 선택 기준 — line vs block.** 같은 그룹 안(리스트 항목·카드 내부·input 밑)은 `type="line"`(1px Border). 의미 단위가 다른 **섹션 사이**는 `type="block"`(8px BG/Section). 섹션 경계를 얇은 line 으로만 그으면 위계가 약하고, 그룹 내부에 두꺼운 block 을 넣으면 과하다.
- **tone 매핑 — subtle/normal/strong.** subtle=카드/모달 내부 등 약한 분할, normal=기본, strong=강조. 톤은 borderRole 토큰(subtle/normal/strong)에 1:1 매핑된다. tone 으로 표현되는 것이 색 SSOT 이므로 `color`/`thickness` 로 톤을 흉내내지 말 것.
- **위치별 권장(usage).** 리스트 아이템 사이=line·H·normal · 카드 내부=line·H·subtle · 섹션 사이=block·H · 인라인 그룹(약관·메뉴)=line·V·normal · input bottom=line·H·normal · Modal/BottomSheet 내부=line·H·subtle.
- **1px·8px 두 표준 외 임의 두께(2/3px) 금지.** line=1px, block=8px 두 값만 정상. `thickness` 는 escape hatch — 표준 두 값으로 부족할 때만 쓰고, 2/3px 같은 어중간한 두께로 새 위계를 만들지 말 것.
- **브랜드/Status 색 divider 금지.** divider 색은 항상 borderRole(또는 block 의 surface.section). brand·error·success 등 의미색을 divider 에 칠하지 말 것 — 분리선은 중립이어야 한다.
- **카드 외곽선 + 내부 divider 동시 금지.** 카드가 이미 외곽 border 로 경계를 갖는데 내부까지 divider 를 촘촘히 넣으면 선이 중복돼 지저분하다. 카드 내부 분할은 `tone="subtle"` 한 줄로 최소화.
- **Line + Block + Vertical 한 화면 혼용 금지.** 한 화면에서 세 형태를 다 쓰면 분리 규칙이 읽히지 않는다. 화면당 분리 어휘를 일관되게(예: 섹션은 block, 그 안은 line) 제한할 것.
- **여백으로 충분하면 divider 를 쓰지 말 것.** 간격(spacing)·Heading 만으로 그룹이 구분되면 divider 는 군더더기. 선은 정말 경계가 필요할 때만.
- 상하 간격은 `spacing` 속성으로 — 대칭이 자동. 간격을 형제의 한쪽 margin/gap 으로만 주면 divider 가 위/아래 비대칭으로 어색해진다.
- List 의 항목 사이에 Divider 를 직접 박지 말 것 — nds-list variant='divided' 가 책임짐.
- orientation='vertical' 은 부모가 flex 컨테이너이고 명시적 높이가 있어야 보임. block 은 가로 전용이라 vertical 과 함께 쓰지 않는다.

## examplesHtml.do

```html
<!-- 섹션 사이 — 8px BG/Section 청크 -->
<section>섹션 A</section>
<nds-divider type="block"></nds-divider>
<section>섹션 B</section>

<!-- 카드 내부 — 약한 1px 라인 -->
<div class="card">
  <div>요약</div>
  <nds-divider tone="subtle"></nds-divider>
  <div>상세</div>
</div>
```

## examplesHtml.dont

```html
<!-- ① 임의 두께(2px) 로 어중간한 위계 — line=1px / block=8px 두 표준만 -->
<nds-divider thickness="2"></nds-divider>

<!-- ② 브랜드/Status 색을 divider 에 칠함 — 분리선은 중립(borderRole) 이어야 -->
<nds-divider color="#2563eb"></nds-divider>
```
