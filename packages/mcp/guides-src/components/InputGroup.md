---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3466-17405
sizeMatrix:
  gap: tight=8 / default=12 (Figma 캐시워크 포 비즈니스 admin 표준) / loose=16
  align: stretch(기본)=모든 child flex:1 균등 / start=본래 너비
---

## summary

한 줄에 form control 여러 개를 묶는 wrapper. FormField 의 단일 child slot 에 넣어 row 다중 input 폼을 만든다 (예: 년/월/일 3-Dropdown, 이메일+도메인 2-Input).

## pitfalls

- FormField 없이 InputGroup 만 단독 — label 없이 row 만 뜨면 의미 전달 불완전.
- 각 child 너비를 px 로 박지 말 것 — stretch(기본)는 flex:1 균등, start 는 본래 너비. 비율 분배가 필요하면 child 에 직접 flex 설정.
- gap='loose'(16) 는 FormField label↔control gap 과 같음 — 시각적으로 그룹 경계가 모호. row 다중 input 은 default(12) 또는 tight(8) 권장.

## recommended

- 년/월/일 3-Dropdown: <nds-form-field label='기간' label-position='left' density='admin'><nds-input-group> 안에 <nds-select> × 3
- 이메일+도메인 2-Input: <nds-input-group gap='tight'><nds-input/><nds-input/></nds-input-group>
- 비율이 다른 케이스 (input + 짧은 button): align='start' 로 본래 너비 유지.

## examplesHtml.do

```html
<nds-form-field label="기간" label-position="left" density="admin">
  <nds-input-group>
    <nds-select placeholder="년"></nds-select>
    <nds-select placeholder="월"></nds-select>
    <nds-select placeholder="일"></nds-select>
  </nds-input-group>
</nds-form-field>
```

## examplesHtml.dont

```html
<!-- FormField 없이 단독 — label 끊김 -->
<nds-input-group><nds-input></nds-input><nds-input></nds-input></nds-input-group>
<!-- child 너비를 px 로 — stretch 효과 깨짐 -->
<nds-input-group><nds-input style="width:200px"></nds-input></nds-input-group>
```
