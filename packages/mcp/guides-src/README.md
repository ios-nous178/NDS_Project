# guides-src — 컴포넌트/패턴 가이드 본문 (SSOT)

`get_guide` 가 외부 프로젝트(AI 목업 작성자)에게 주는 **컴포넌트/패턴 가이드 본문의 진리원천**.
가이드 하나 = 파일 하나. 파일명(확장자 제외) = 가이드 키 = `name`.

- `components/<Name>.md` → `COMPONENT_GUIDES.<Name>`
- `patterns/<name>.md` → `PATTERN_GUIDES.<name>`

## 고치는 법

1. 해당 `.md` 수정 — frontmatter(YAML) = 구조 필드(usagePolicy/매트릭스/references/figmaNodeUrl…),
   본문 = `## summary`(prose) · `## pitfalls`/`## rules`(`- ` 불릿) · `## examples.do` 류(코드 펜스).
2. `pnpm --filter @nudge-design/mcp build:guides` → `src/guides.generated.ts` 재생성, 같이 커밋.
3. `pnpm lint`(check-ssot)가 stale·스키마 위반(미지 필드·프로젝트 키·summary 누락)을 차단한다.

## 규칙

- `name` 은 frontmatter 에 쓰지 않는다(파일명이 SSOT).
- 리스트 항목 내 개행은 2칸 들여쓰기 연속행. 항목 안에 빈 줄·`- ` 줄 시작 금지.
- 외부 전파는 여전히 MCPB 릴리즈 — 가이드만 고쳐도 changeset(patch) + 릴리즈 필요(/ds-release).
- 원칙/어드민/UX라이팅/아이콘 메타는 여기 아님 → `src/guides.ts` 에 그대로 산다.
