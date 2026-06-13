# 레포 문서·스크립트 구조 점검 보고서 (2026-06-13)

"문서/스크립트가 너무 많아 알아보기 어렵지 않나"에 대한 실측 점검. **결론: scripts/ 는 외형과 달리
완전히 건강하고(40개 전부 호출처 존재, 고아 0), 진짜 어수선함은 docs/ 에 있다 — 죽은 발표 자료
4건, 성격이 다른 문서의 drafts/ 혼재, 그리고 컴포넌트 문서 3중 표면.**

## 1. scripts/ — 정리 불필요 (인식과 실측의 괴리)

40개 파일 전수 역추적 결과 **고아 0건**. 모든 파일이 package.json scripts / `scripts/gates.mjs` /
CI 워크플로 / husky / `.claude/settings.json`(claude-hook-precommit.mjs) 중 한 곳 이상에서 호출된다.
명명도 `check-* / generate-* / sync-* / pack-*` + baseline JSON 동거로 일관적.

다만 **npm script 이름과 파일 이름의 어긋남**이 가독성을 깎는다: 파일은 `check-*.mjs` 인데 npm
script 는 `lint:*` 로 노출 (예: `lint:mirror-parity` → `check-mirror-parity.mjs`). 루트 스크립트
56개를 사람이 스캔하기는 이미 버겁다.

→ 권장: `scripts/README.md` 를 **gates.mjs 에서 생성**(게이트명·파일·npm alias·역할 1줄 표).
게이트 SSOT 가 이미 구조화돼 있어 생성기는 ~30줄. 스크립트를 옮기거나 줄일 필요는 없다.

## 2. docs/ — 실제 정리 대상 (151파일)

| 위치                                                                                                                                           | 수량 | 판정                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------- |
| `docs/components/*.mdx`                                                                                                                        | 119  | 활성이지만 **수기 유지 비용의 본체** → 생성물 전환 제안은 [component-docs-automation.md](component-docs-automation.md) |
| `docs/guide/`                                                                                                                                  | 11   | 활성 — 70% 가 MCP 소스에서 생성, 게이트 보호. 모범 사례                                                                |
| `docs/` 루트 비정형 4건 — `kraft-vs-nudge-studio-comparison.{html,svg}` · `the-goal-act7-summary.html` · `context-collection-architecture.svg` | 4    | **죽음** — 레포 어디서도 참조 0. 발표/비교 일회성 산출물 (2026-06-09)                                                  |
| `docs/drafts/`                                                                                                                                 | 4    | 혼재 — 감사 보고서(살아있는 결정 문서)와 슬랙 공지 초안(발송 후 휘발성)이 같은 폴더                                    |
| `docs/plans/` · `docs/reference/`                                                                                                              | 각 1 | 활성, 소수라 문제 없음                                                                                                 |
| 루트 가이드 md (getting-started 등 7)                                                                                                          | 7    | 활성 — docusaurus 게시면                                                                                               |

### 권장 조치 (전부 이동/삭제 수준, 코드 영향 0)

1. **삭제**: 비정형 4건. git 히스토리에 남으므로 보존 가치 있으면 커밋 메시지에 경위만 적고 지운다.
   (docusaurus broken-link 가드가 CI 에 있으니 `pnpm docs:build` 한 번으로 무참조 재확인 가능.)
2. **drafts/ 분리**: 발송·게시가 끝난 초안(`mcp-announcement-slack.md` 등)은 삭제 또는
   `docs/archive/` 로. drafts/ 에는 "아직 실행 안 된 결정 문서"(감사 보고서류)만 남긴다.
3. **루트 가이드 md 의 대문자 명명**(COMPONENT_DOC_TEMPLATE 등)과 소문자(getting-started) 혼재는
   docusaurus sidebar 가 title 로 노출하므로 실해는 없음 — 건드리지 않는 게 이득.

## 3. 그 외 표면

- 루트 파일 14개 — AGENTS.md(생성물)·CLAUDE.md(SSOT) 구조와 sync 게이트가 이미 drift 를 차단.
  현 상태 유지.
- `.claude/skills/`(SSOT) + `.agents/skills/`(생성물) 이중 트리 — 의도된 설계고 `sync-skills.mjs
--check` 가 지킨다. 현 상태 유지.
- 정리의 우선순위: **docs/components 생성물 전환 > drafts/아카이브 규칙 > 죽은 파일 4건 삭제 >
  scripts/README 생성**. 앞의 둘이 유지 비용을 실제로 줄이고, 뒤의 둘은 가독성 개선이다.
