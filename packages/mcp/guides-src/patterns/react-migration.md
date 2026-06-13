---
{}
---

## summary

기존 React 앱 코드를 Nudge DS 로 옮길 때의 결정 트리 — **하이브리드**다. 기계적·결정적인 교체는 `@nudge-design/migrate` 코드모드(DS 번들에 동봉)가 처리하고, 의미가 미묘한 것은 DS 가이드를 보고 사람/LLM 이 손으로 한다. "nds로 (가능한 거) 교체해줘" 요청을 받으면 아래 순서로 진행한다. 검증은 **앱의 typecheck**가 책임진다(코드모드는 앱 코드를 검증하지 않는다).

## rules

- **진행 순서**: ① 코드모드 먼저(기계적·결정적) → ② 코드모드가 못 잡은 건 `find_component`/`get_guide` 로 DS 컴포넌트·props 를 확인해 손/LLM 편집 → ③ **앱 typecheck 로 검증**(prop 누락·시그니처 불일치는 컴파일에서 잡힌다).
- **코드모드가 자동 교체하는 것**(결정적·안전): `button`(className→variant) · `input`(텍스트형 native) · `badge`(span.badge→color) · `chip`(텍스트 자식→label) · `textarea`(native). className 문자열 리터럴·native 속성 기반의 안전한 케이스만 건드린다.
- **코드모드가 건드리지 않는 것 = 사람/LLM 영역**: 표현식 className(`{cx(...)}`)·미인식 패턴 / **Modal**(compound `Modal.Root/Body/Header/Footer` 재구조화 필요) / **checkbox·radio**(native `onChange(event)` → DS `onCheckedChange(boolean)` 시그니처 변경이라 기계적 불가) / **FormField**(label+input 래핑 재구조화). 이건 가이드 보고 손으로 조립한다.
- **배포/실행**: 코드모드는 npm 에 publish 하지 않고 **DS MCP 번들(MCPB)에 동봉돼 함께 전달**된다. 실행은 번들에 포함된 `nds-migrate` CLI 로(에이전트가 셸에서 호출). MCP 는 *워크플로를 알려주고*(이 가이드), 코드모드 CLI 가 *실행*한다 — 별개.
- **토큰**: raw hex·inline 색/여백은 `suggest_replacement`(MCP)로 시멘틱 토큰으로 치환.
- **안전 원칙**: 애매하면 바꾸지 않는다(코드모드 기본값). 자동 교체는 되돌리기 쉬운 것만, 정책/디자인 판단이 필요한 건 사람이 게이트(거버넌스 B5 AI 경계와 동일).
- **흐름 예**: ① `nds-migrate src/**/*.tsx`(button/input/badge/chip/textarea 결정적 교체 + import 자동 병합) → ② 남은 Modal·checkbox 는 `get_guide({ topic:'component:Modal' })` 보고 손 조립 → ③ `tsc --noEmit`.

## avoid

- Modal·checkbox·radio·FormField 를 코드모드에 욱여넣기 — onChange(event)→onCheckedChange(boolean) 시그니처·compound 구조가 깨진다. 사람/LLM 이 가이드 보고 조립.
- 코드모드 결과를 **typecheck 없이** 커밋 — prop 누락/시그니처 불일치는 앱 컴파일에서만 드러난다.
- 표현식 className(`{cx(...)}`)을 억지로 문자열화해 교체 — 런타임 클래스 로직이 사라진다(코드모드가 일부러 skip 하는 이유).
- DS 에 1:1 대응이 없는 커스텀 컴포넌트를 무리하게 치환 — 추가 prop/동작을 잃는다.
