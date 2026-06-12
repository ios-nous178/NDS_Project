---
metrics:
  masterCheckbox: Checkbox indeterminate (자식 비율로 파생)
  requiredEnforcement: 호출부 책임 (필수 미동의 → 진행 불가)
  preTick: 금지 (개인정보보호법)
  hierarchy: 1단계 (계층은 CheckboxTree)
---

## summary

약관/개인정보 동의 화면 — 전체동의 + 필수/선택 + 약관 펼침. DS 는 전용 컴포넌트 대신 **Checkbox(indeterminate) 조립 패턴**으로 간다(MUI/Ant 가 indeterminate Checkbox 만 주고 동의 화면은 앱이 조립하는 것과 같은 층위). 한국 개인정보보호법 정합(능동 동의·pre-tick 금지·필수/선택 구분)이 핵심이라 패턴으로 박제한다.

## rules

- 마스터 '전체 동의' 체크박스는 자식 선택 비율로 **파생** — 모두 체크=checked, 일부=indeterminate(옐로우 마이너스), 전무=unchecked. `<Checkbox indeterminate>`(HTML `<nds-checkbox indeterminate>`)를 그대로 쓴다. 색/아이콘을 직접 손계산하지 말 것.
- 전체동의 클릭 동작: '모두 체크면 전체 해제, 아니면(부분/전무) 전체 체크'. 전체동의는 **독립 상태를 갖지 않고 항상 자식에 의존** — 이 동기화가 동의 화면 #1 버그 지점이다.
- **필수/선택 구분 필수** — 각 항목에 `[필수]`/`[선택]` badge 명시. **`badge:"[필수]"` 면 CheckboxGroup 이 자동으로 빨강+bold 강조**(필수=text statusError) — `required` 를 따로 안 붙여도 된다. `[선택]` 은 회색(text subtle). 필수 미동의 시 다음 단계 진행 불가(가드는 호출부 책임).
- **pre-tick(선택 항목 기본 체크) 금지** — 마케팅 수신 등 선택 항목을 미리 체크해두면 개인정보보호법상 능동 동의가 아니라 위법(행정처분 대상). 초기 value 는 빈 배열 또는 사용자가 과거 동의한 것만.
- 전체동의는 사용자가 직접 누른 능동 동의라 합법 — 단 누르면 선택까지 싹 체크되는 마찰을 줄이려면 '필수만 동의' 보조 동선 또는 필수/선택 전체동의 분리를 검토(토스식).
- 약관 전문은 detail 펼침(chevron 접기/펼치기)으로 — 기본 접힘, 필요 시 확장. 전문이 길면 '전문 보기' 외부 링크.
- **`CheckboxGroup`(items + `selectAll`)으로 조립** — items 의 `badge`([필수]/[선택]) · `detail`(약관 전문 펼침) 슬롯 + 전체선택(자동 indeterminate)이 동의 화면을 그대로 커버한다. 개별 원자는 `<Checkbox>`. 별도 동의 전용 컴포넌트를 새로 만들지 말 것. component:CheckboxGroup.

## avoid

- 전체동의 상태를 자식과 독립으로 관리 — 체크 동기화가 깨진다(동의 화면 최다 버그).
- 선택 항목을 기본 체크(pre-tick) — 위법(개인정보보호법, 능동 동의 아님).
- 부분 선택을 그냥 빈 체크로 표시 — indeterminate(마이너스)로 시각화해야 '일부 동의'가 보인다.
- 필수/선택 구분 없이 '전체 동의'만 노출 — 사용자가 무엇에 동의하는지 불명확 + 법적 리스크.
- 계층(시/도 ▸ 시/군구) 다중 선택을 이 패턴으로 — 그건 component:CheckboxTree(부모 indeterminate 자동).
