---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3082-846
sizeMatrix:
  top: label 위, control 아래. 모바일/일반 폼 기본. label-row column flex.
  left: label 좌측 고정(width 기본 180px, labelWidth prop), control 우측 1fr. 라벨 시작점 = control 시작점 (root align-items:flex-start 로 top 정렬) — Figma 정합. 입력 높이와 무관하게 라벨이 항상 control 상단에 붙는다 (예전 baseline 보정 padding-top 은 중앙 끌어내림 + 고정 px 라 입력 높이가 다르면 라벨이 처지던 버그여서 제거).
  density:default: label caption1 (13/18), helper caption (12/16). 자체 padding 0 — 부모 stack 이 간격 결정.
  density:admin: label body1 (16/24, ≡ Figma Subtitle1/Medium), helper body3 (14/20, ≡ Figma Body2/Regular), 자체 py-24 → stack 시 자동 시각 48px 간격 (Figma FormSection 3387:871 표준).
---

## summary

Input / Textarea / Select 같은 form control 의 label / helper / error / counter 슬롯을 묶는 래퍼. label-position(top|left) + density(default|admin) 조합으로 모바일/admin 폼을 한 컴포넌트로 처리.

## pitfalls

- label 또는 html-for 누락 — Form 안의 input id 와 라벨이 끊겨 접근성이 깨짐.
- error 와 helper 를 동시에 표시 — 사용자는 어떤 메시지를 우선해야 할지 혼란. error 모드에서는 helper 숨김.
- counter 는 max-length 가 명확한 textarea / input 에서만 사용.
- label-position='left' + description 동시 사용 — description 이 있으면 자동으로 top 으로 폴백 (좌측 좁은 컬럼에 멀티라인 설명을 욱여넣지 않기 위함).
- density='admin' 인데 stack 사이에 별도 gap 24/48 박음 — FormField 자체 py-24 가 이미 시각 48px 을 만드므로 이중 간격이 됨. 부모는 그냥 flex column 으로 두고 FormField 가 알아서 간격 책임지게 할 것.
- density 와 size 혼동: density 는 FormField 의 label/helper 톤·padding, size 는 Input/Select 의 height. 캐포비 admin 표준 = density='admin' + size 미지정(또는 field) → 48px. 옛 compact(40)은 admin 표준이 아니었고 API 에서 제거됨.
- FormField child 슬롯에 raw <div> + 수기 flex 로 input 여러 개 — 대신 InputGroup 컴포넌트 사용 (gap 12 + flex:1 균등 자동).

## recommended

- 모바일/일반 폼: <nds-form-field label='이름' helper='실명' required> + <nds-input>
- 캐시워크 포 비즈니스 admin 표준 (단일 input): <nds-form-field label='Label' label-position='left' density='admin'> + <nds-input / nds-select> (size 미지정 → 캐포비 brand 48px cascade)
- 캐시워크 포 비즈니스 admin 표준 (row 다중 input): density='admin' FormField 안에 <nds-input-group> 으로 input 묶기 — gap 12 균등 분할 (Figma 3466:17405 패턴)
- FormSection (FormField 두 개 이상 stack): 부모는 <div class='form-card'> (radius 16, padding 24, white bg) + 안에 <nds-form-field density='admin'> 들을 그냥 flex column 으로 쌓기. 각 FormField 의 py-24 가 자동으로 시각 48px 간격을 만듦.
- 글자수 카운터: counter='12 / 200' — Textarea 같이 max-length 가 명확할 때만.
- 라벨 전략(하이브리드): label prop 이 있는 컨트롤(Input/Textarea/Select/AmountInput/PhoneInput/SearchInput/TagInput/TimePicker/Autocomplete/AddressPicker)은 bare 로도 완전한 필드 — 검색바·툴바 필터·테이블 셀·단일필드엔 굳이 FormField 로 감싸지 않는다. **자체 label 이 없는 컨트롤(MultiSelect·DateRangePicker·FileUpload·ImageUpload·Slider)** 에 필드 라벨이 필요하면 FormField 로 감싼다. left-label/admin density/counter/description 도 FormField 전용.

## examplesHtml.do

```html
<!-- 모바일/일반 폼 -->
<nds-form-field label="이름" helper="실명을 입력해주세요" html-for="name-input" required>
  <nds-input id="name-input" name="name"></nds-input>
</nds-form-field>

<!-- 캐시워크 포 비즈니스 admin: label 좌측 + admin density (height 48 cascade) -->
<nds-form-field label="Label" label-position="left" density="admin" html-for="admin-name">
  <nds-input id="admin-name" placeholder="값을 입력하세요"></nds-input>
</nds-form-field>

<!-- row 다중 input — InputGroup -->
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
<!-- htmlFor (React 표기) — vanilla HTML 에선 html-for 만 동작 -->
<nds-form-field label="이름" htmlFor="x"><nds-input id="x"></nds-input></nds-form-field>
<!-- admin 인데 부모에 gap 박음 — 이중 간격 -->
<div style="display:flex;flex-direction:column;gap:24px">
  <nds-form-field density="admin">...</nds-form-field>
  <nds-form-field density="admin">...</nds-form-field>
</div>
<!-- 수기 flex 로 row 다중 input — InputGroup 써야 함 -->
<nds-form-field label="기간"><div style="display:flex;gap:12px"><nds-input/><nds-input/></div></nds-form-field>
```
