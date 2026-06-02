---
"@nudge-design/mcp": minor
---

경량 DesignSpec(중간표현) 도입 — prompt → DesignSpec(JSON) → code.

- 새 MCP 도구 2개:
  - `save_design_spec` — 경량 DesignSpec 을 카탈로그 기준으로 검증한 뒤 `<cwd>/design-spec.json` 으로 저장. `ok:false` 면 violations 를 고쳐 재저장(validate-before-code). 코드 작성 전에 사용자에게 보여주고 동의를 받는 soft 승인 게이트.
  - `validate_design_spec` — 파일 쓰기 없이 스펙만 검증(자기교정 루프용).
- DesignSpec 은 *의도*만 담는다: 컴포넌트 트리(시멘틱 이름)·시멘틱 토큰 이름(hex 금지)·brand/surface·결정 근거. 좌표·resolved 색·px·이미지는 담지 않는다 — 그건 코드→Figma `scene.json`(역방향 추출) 담당.
- 컴포넌트 어휘는 `scene.ts` 의 `ndsTagToComponentName` 규칙을 공유(`Button` 또는 `nds-button` 둘 다 허용) — 정방향 spec ↔ 역방향 scene 을 컴포넌트 정체성으로 JOIN 가능(Phase 3 인스턴스 승격 대비).
- 검증 룰: 시멘틱 토큰 only(raw hex/rgb → error, raw 팔레트 → warn), 카탈로그에 없는 토큰 → error, 브랜드 실재 검사(silent base-blue 폴백 가드, html-validator 의 unknown-brand-slug 와 동일 의미), 컴포넌트 존재(unknown → warn), prop enum 위반 → error.
- `get_guide({ topic: 'pattern:design-spec' })` 추가 — 스펙 스키마·soft gate·언제 쓰는지 SSOT. CLAUDE.md html 템플릿에도 조건부 `§1-bis` 단계로 안내(단순 화면은 생략).
- 카탈로그(tokenSet/componentNames/propAllowedValues/ndsAttrEnums + 브랜드 셋)는 `configureDesignSpec` 으로 주입(configureHtmlValidator 패턴 미러). `validateDesignSpec` 는 순수 함수 — vitest 단위검증 20건.
