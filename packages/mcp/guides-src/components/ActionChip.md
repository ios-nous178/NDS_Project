---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3082-976
sizeMatrix:
  height: 20-24px (라벨/아이콘 sizing 에 따라 자동)
  iconBox: 14 × 14 (icon.normal)
  label: caption1 12/16 Medium · text.subtle
  bg: fill.neutralSubtle (hover surface.section)
  radius: sm(6)
  padding: 2px / 6px (vertical / horizontal)
  gapIconLabel: 2px (spacing[2])
stateMatrix:
  default: bg fill.neutralSubtle · text.subtle · icon.normal
  hover: bg surface.section
  disabled: opacity 0.6 · cursor not-allowed
usagePolicy:
  useFor:
    - TextField · ImageUpload 등 입력 컴포넌트 helper 옆 보조 액션 (예시/수정/다운로드)
    - 한 폼 안에서 여러 inline 액션을 가로로 묶기
  doNotUseFor:
    - 주요 CTA — Button 사용
    - 단순 라벨/태그 (클릭 없음) — Badge / Chip
    - 필터/선택 칩 (다중 토글) — Chip
  limits:
    iconSize: 14
    labelTypography: caption1 12/16 Medium
    maxInRow: 권장 4 이하 (helper 영역 폭 제한)
---

## summary

TextField helper/description 영역 옆에 붙는 작은 보조 액션 chip. 아이콘(14px) + 라벨(caption1 Medium). bg fill.neutralSubtle, radius sm(6), padding 2/6.

## pitfalls

- 주요 CTA 자리에 쓰지 말 것 — 시각 위계가 캡션 톤. 주요 액션은 Button.
- 별도 row 로 떨어뜨리지 말 것 — TextField helper text 와 **inline** 으로 같은 줄.
- 아이콘 사이즈는 14px 기준 — 큰 아이콘을 그대로 넘기면 chip 이 부풀음. `width={14} height={14}` 강제.
- `kind` enum 같은 분기 prop 없음 — 사용처가 적절한 아이콘 import 해서 `icon` 으로 넘김 (Example/Edit/Download 는 가이드 사례일 뿐).
- ButtonHTMLAttributes 상속 — `type` / `children` 은 internal 이라 prop 으로 받지 않음.

## recommended

- 기본: <ActionChip icon={<DownloadIcon width={14} height={14} />} label="다운로드" onClick={…} />
- 여러 개 묶기: flex container + gap 8 (TextField helper 영역과 inline)
- 아이콘 없이 텍스트만: <ActionChip label="안내 보기" onClick={…} />

## accessibility

- ButtonHTMLAttributes 상속 — `aria-label` / `aria-describedby` 자유 부착.
- 키보드: Tab focus + Enter/Space 자동 (native button).
- disabled 시 native `disabled` 속성 그대로 — screen reader 가 비활성 안내.

## examplesHtml.do

```html
<nds-action-chip label="필터 추가">
  <svg slot="icon" viewBox="0 0 24 24">…</svg>
</nds-action-chip>
```

## examplesHtml.dont

```html
<!-- nds-action-chip 대신 nds-chip + onclick 으로 액션 트리거 흉내 -->
<nds-chip onclick="addFilter()">+ 필터</nds-chip>
```
