---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

`TitleBlock` → `TitleGroup` 로 이름 변경 (헤딩 + 서브타이틀 표준 블록).

업계 표준(Atlassian/Primer/Polaris/Carbon 등)을 조사한 결과, 페이지 헤더 셸은 `PageHeader` 라는 이름이 거의 보편적이라 그대로 두고, 헤딩+서브타이틀을 묶는 타이포 유틸은 비표준 이름이던 `TitleBlock` 대신 "묶음" 의미가 명확하고 `Block`(레이아웃 스택)과의 혼동을 피하는 `TitleGroup` 으로 정리했습니다. props(`level`/`title`/`subtitle`)·동작·토큰 매핑은 동일합니다.

**⚠️ Breaking — 외부 프로젝트 마이그레이션 필요:**

- React: `import { TitleBlock }` → `import { TitleGroup }`. 타입 `TitleBlockProps`/`TitleBlockLevel` → `TitleGroupProps`/`TitleGroupLevel`.
- HTML(웹컴포넌트): `<nds-title-block>` → `<nds-title-group>`. 클래스 `NdsTitleBlock` → `NdsTitleGroup`.
- CSS 클래스: `.nds-title-block`(`__title`/`__subtitle`) → `.nds-title-group`. 직접 셀렉터를 타기팅한 커스텀 스타일이 있으면 같이 변경.

`PageHeader` 는 변경 없음. `PageHeader`/`Card` 안에 `TitleGroup` 을 중첩하는 패턴은 그대로 정상입니다.
