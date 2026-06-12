---
figmaNodeUrl: https://www.figma.com/design/MqR7O3uvBvH5tVngwzbqGH/?node-id=1380-13
---

## summary

trigger 에 마우스 hover / focus 시 보조 설명(Figma 1380:13). **단일 다크 톤** — 배경 `--nds-tooltip-bg`(fill.neutral 역할, #333) + 흰 텍스트(Caption1 Medium 13), padding 14/16, radius 8, **꼬리 12×8 triangle**(본체 외부 가운데). Position 4종(Top/Bottom/Left/Right, 트리거 기준), trigger=Hover·Focus, delay Show 200ms·Hide 0ms(플리커 방지), z-index 1400(모달·토스트보다 아래), **동시 1개만 노출**. **두 줄·여러 줄 본문 허용** — 짧은 힌트는 `content` 속성(자동 줄바꿈, 1줄 권장·최대 2줄), 제목+불릿 같은 **리치 안내**(예: 캐포비 '권한 안내')는 `<template slot="content">` 로 넣고 `max-width` 로 폭 조절. 모바일/터치 only 환경에선 사실상 안 보이므로 핵심 정보는 본문에 둘 것.

## pitfalls

- Tooltip 안에 인터랙티브 요소(링크/버튼) — 모바일/터치에서는 도달 불가.
- trigger 가 aria-label 만 갖고 visible 텍스트가 없는 아이콘 버튼인데 Tooltip 도 같은 내용 — 중복.
- 본문 길이/줄 수 제한은 없음 — 두 줄·여러 줄·제목+불릿 리치까지 허용(`<template slot="content">` + 필요 시 `max-width`). 단 (a) 사용자의 응답/결정이 필요하면 component:ConfirmTooltip(가벼운 인라인 확인) 또는 Modal/Popup(차단형), (b) 한 화면을 채울 만큼 길면 Modal — Tooltip 은 어디까지나 hover 보조 안내. (이전의 '한 문장 초과 금지' 규칙은 폐기.)
- 리치 본문은 `content` 속성(평문)이 아니라 **`<template slot="content">`** 로 — HTML(제목 `<p style="font-weight:700">` · 불릿 `<ul><li>` · 강조 `<strong>`)을 넣어야 렌더된다. content 속성에 태그 문자열을 넣으면 그대로 escape 됨.

## examplesHtml.do

```html
<!-- ① 짧은 힌트(자동 줄바꿈) -->
<nds-tooltip content="삭제하면 복구할 수 없어요" placement="top" trigger-label="?"></nds-tooltip>
<!-- ② 리치 안내(제목+불릿·멀티라인) — 캐포비 권한 안내 형태 -->
<nds-tooltip trigger-label="?" placement="top" max-width="346" open>
  <template slot="content">
    <p style="font-weight:700">권한 안내</p>
    <ul>
      <li>비즈니스 계정 : <strong>모든 광고 계정</strong>에 접근할 수 있으며, 광고 계정 생성 및 수정 권한을 가집니다.</li>
      <li>일반 계정 : <strong>초대된 광고 계정</strong>에 한해 광고 조회 및 관리가 가능합니다.</li>
    </ul>
  </template>
</nds-tooltip>
```

## examplesHtml.dont

```html
<!-- 모바일에서 보이지 않는 본질 정보를 툴팁에만 -->
<nds-tooltip content="이용약관 동의가 필수입니다" trigger-label="?"></nds-tooltip>
<!-- 리치 본문을 content 속성에 태그 문자열로 (escape 되어 깨짐) -->
<nds-tooltip trigger-label="?" content="<strong>권한 안내</strong><ul>..."></nds-tooltip>
```
