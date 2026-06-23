---
"@nudge-design/tokens": patch
---

Radius·Stroke 프리미티브 Figma(캐시워크 라이브러리) 정합 — 전 서비스 공통 스케일 일원화

- **Radius 스케일 확장**: `--radius-0`(직각)·`--radius-6`(중소형 모서리) 추가. 기존 단계(2/4/8/10/12/16/20/24/full)는 유지. Figma RadiusGuide 와 1:1 정합. (radius 프리미티브 CSS 변수는 컴포넌트가 직접 소비하지 않고 `--nds-{c}-radius` 슬롯을 거치므로 기존 렌더링 영향 없음.)
- **⚠️ Stroke 토큰 rename (breaking)**: `--stroke-thin/medium/bold` → **`--stroke-default`(1px) · `--stroke-focus`(2px)**. Figma StrokeGuide 의 3단계(none/default/focus)로 통일하고, 두께로 위계를 만들지 않는 원칙(일반 강조 = 1px + Border 컬러)에 맞춰 구 1.5px(medium)은 폐지·default(1px)로 흡수. DS 컴포넌트 전면 마이그레이션 완료(react·html). **외부 코드에서 `var(--stroke-thin|medium|bold)` 를 직접 참조했다면 `--stroke-default` / `--stroke-focus` 로 교체가 필요합니다.**
- **NudgeEAP radius 오버로드 제거**: nudge-eap 오버레이가 base 와 값이 동일한 radius 스케일을 중복 재emit 하던 블록을 제거. 이제 **radius·stroke 둘 다 base 단일 스케일**로 전 서비스(캐시워크·캐포비·지니어트·NudgeEAP·트로스트·런마일) 공통이며, 어떤 프로젝트도 오버로드하지 않습니다.
