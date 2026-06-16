/**
 * gates.mjs — SSOT 게이트 정의 단일 출처.
 *
 * check-ssot.mjs(CI) / fix-all.mjs(pnpm fix) / precommit-gate.mjs(pre-commit) 세 소비자가
 * 같은 게이트 목록을 공유한다. 게이트를 추가/변경할 때 여기 한 곳만 고치면 세 표면이
 * 같이 움직인다 — pre-commit 과 CI 의 기준이 갈라지는 drift 를 구조적으로 차단.
 *
 * 필드:
 *   id         게이트 식별자
 *   label      사람용 설명
 *   check      [command, ...args] — 검증 모드 (non-mutating, 실패 시 exit 1)
 *   fix        [command, ...args] | null — 쓰기 모드. null 이면 자동 수정 불가(소스를 사람이 고침)
 *   fixHint    fix 가 null 일 때 사람이 할 일 안내
 *   watch      staged 파일 prefix 목록 — precommit-gate 가 관련 게이트를 선별하는 기준
 *   buildFree  true 면 소스만 읽는 게이트 → pre-commit 에서 실행 가능.
 *              false 면 dist/catalog 등 빌드 산출물을 읽음 → stale dist 오탐이 있어
 *              fix-all(빌드 후) / CI 에서만 실행한다.
 *   ssot       check-ssot.mjs(lint:ssot) 단계에 포함되는지 (배열 순서 = 실행 순서)
 */

/** fix-all / check-ssot 이 공유하는 패키지 빌드 순서 (의존 토폴로지). */
export const BUILD_FILTERS = [
  "@nudge-design/tokens",
  "@nudge-design/icons",
  "@nudge-design/styles",
  "@nudge-design/react",
  "@nudge-design/mcp",
];

export const GATES = [
  // ── check-ssot.mjs 단계 (순서 유지) ──────────────────────────────────────
  {
    id: "build-guides",
    label: "guide markdown sources (guides-src → guides.generated.ts)",
    check: ["node", "packages/mcp/scripts/build-guides.mjs", "--check"],
    fix: ["node", "packages/mcp/scripts/build-guides.mjs"],
    watch: ["packages/mcp/guides-src/", "packages/mcp/src/guides.generated.ts"],
    buildFree: true,
    ssot: true,
  },
  {
    id: "asset-catalog",
    label: "asset catalog (@nudge-design/assets/src/files → asset-catalog.generated.ts)",
    check: ["node", "packages/mcp/scripts/build-asset-catalog.mjs", "--check"],
    fix: ["node", "packages/mcp/scripts/build-asset-catalog.mjs"],
    watch: ["packages/assets/src/files/", "packages/mcp/src/asset-catalog.generated.ts"],
    buildFree: true,
    ssot: true,
  },
  {
    id: "mcp-catalog",
    label: "MCP catalog freshness",
    check: ["node", "scripts/check-mcp-catalog.mjs", "--no-build"],
    fix: ["pnpm", "--filter", "@nudge-design/mcp", "build:manifest"],
    watch: [
      "packages/react/src/",
      "packages/html/src/",
      "packages/styles/src/",
      "packages/tokens/src/",
      "packages/mcp/src/",
    ],
    buildFree: false, // 빌드된 dist 기준 비교 — stale dist 에서 오탐
    ssot: true,
  },
  {
    id: "mirror-parity",
    label: "react/html mirror parity",
    check: ["node", "scripts/check-mirror-parity.mjs", "--no-regen"],
    fix: null,
    fixHint:
      "신규 drift 는 미러(react↔html)를 맞춰서 해소. 의도된 divergence 면 " +
      "`pnpm lint:mirror-parity:update` 후 baseline 의 reason:'TODO' 에 사유를 직접 기입.",
    watch: ["packages/react/src/", "packages/html/src/components/"],
    buildFree: false, // catalog.json(빌드 산출물) 이 SSOT
    ssot: true,
  },
  {
    id: "style-token-parity",
    label: "react/html 색 토큰 parity (styles 우회 색맵 drift)",
    check: ["node", "scripts/check-style-token-parity.mjs"],
    fix: null,
    fixHint:
      "양쪽 색맵을 같은 시멘틱 토큰으로 맞추세요(react .tsx ↔ html nds-*.ts[/.styles.ts]). " +
      "근본 해소는 색맵을 공유 styles/[data-variant] 로 이전. 의도된 divergence 면 " +
      "`node scripts/check-style-token-parity.mjs --update` 후 baseline 의 reason:'TODO' 에 사유 기입.",
    watch: [
      "packages/react/src/",
      "packages/html/src/components/",
      "packages/tokens/src/cssVar.ts",
      "scripts/style-token-parity-baseline.json",
    ],
    buildFree: true, // cssVar.ts 소스 + 컴포넌트 소스만 파싱 — dist 불필요
    ssot: true,
  },
  {
    id: "input-tests",
    label: "input focus-preservation tests",
    check: ["node", "scripts/check-input-tests.mjs"],
    fix: null,
    fixHint: "입력 계열 컴포넌트에 포커스 보존 테스트(packages/html/test)를 추가하세요.",
    watch: ["packages/html/src/components/", "packages/html/test/"],
    buildFree: true,
    ssot: true,
  },
  {
    id: "behavior-tests",
    label: "상호작용 위젯 동작 테스트 (react behavior/a11y 회귀 가드)",
    check: ["node", "scripts/check-behavior-tests.mjs"],
    fix: null,
    fixHint:
      "복잡 상호작용 위젯에 user-event 로 키보드/클릭/포커스/aria 동작 테스트를 " +
      "packages/react/test/component/{Name}.test.tsx 에 추가하거나, 사유와 함께 " +
      "scripts/behavior-test-baseline.json 에 등재하세요.",
    watch: [
      "packages/react/src/",
      "packages/react/test/component/",
      "scripts/check-behavior-tests.mjs",
      "scripts/behavior-test-baseline.json",
    ],
    buildFree: true, // react src/test 소스만 읽음 — dist 불필요
    ssot: true,
  },
  {
    id: "brand-completeness",
    label: "brand semantic completeness",
    check: ["node", "scripts/check-brand-completeness.mjs"],
    fix: null,
    fixHint:
      "base 시멘틱 leaf 를 4개 브랜드에 명시 정의하거나, 사유와 함께 " +
      "scripts/brand-completeness-baseline.json waiver 에 추가하세요.",
    watch: ["packages/tokens/src/"],
    buildFree: false, // packages/tokens/dist/brands/*.semantic.js 를 읽음
    ssot: true,
  },
  {
    id: "tailwind-presets",
    label: "brand Tailwind preset 완전성 (브랜드마다 <brand>Preset)",
    check: ["node", "scripts/check-tailwind-presets.mjs"],
    fix: null,
    fixHint:
      "packages/tailwind-preset/src/index.ts 에 누락 브랜드의 `export const <brand>Preset` 를 " +
      "추가하세요 (trostPreset/cashwalkBizPreset 구조 미러: atomic palette + radius + typography + shadow).",
    watch: ["packages/tokens/src/brands/", "packages/tailwind-preset/src/"],
    buildFree: true, // 소스 텍스트만 파싱 — dist 불필요
    ssot: true,
  },
  {
    id: "component-attrs",
    label: "generated component-attrs freshness",
    check: ["node", "packages/html/scripts/generate-component-attrs.mjs", "--check"],
    fix: ["node", "packages/html/scripts/generate-component-attrs.mjs"],
    watch: ["packages/html/src/"],
    buildFree: true,
    ssot: true,
  },
  {
    id: "storybook-catalog",
    label: "Storybook catalog coverage (스토리·inventory·gallery 태그 3면 대조)",
    check: ["node", "scripts/check-storybook-catalog.mjs"],
    fix: null,
    fixHint:
      '신규 컴포넌트는 metadata/componentInventory.json 등록 + 대표 스토리에 tags:["gallery"] 태깅. ' +
      "의도된 제외는 scripts/storybook-catalog-baseline.json 에 사유와 함께 추가.",
    watch: [
      "apps/storybook/src/stories/",
      "metadata/componentInventory.json",
      "packages/react/src/index.ts",
      "scripts/storybook-catalog-baseline.json",
    ],
    buildFree: true,
    ssot: true,
  },
  {
    id: "component-guides",
    label: "component guide JSON",
    check: ["node", "scripts/generate-component-guides.mjs", "--check"],
    fix: ["node", "scripts/generate-component-guides.mjs"],
    watch: ["packages/mcp/guides-src/", "packages/mcp/src/"],
    buildFree: false, // packages/mcp/dist/guides.js 를 읽음
    ssot: true,
  },
  {
    id: "brand-coverage",
    label:
      "brand coverage manifest (metadata/coverage-manifest.json — 보드는 공유 컴포넌트가 렌더)",
    check: ["node", "scripts/generate-brand-coverage.mjs", "--check"],
    fix: ["node", "scripts/generate-brand-coverage.mjs"],
    watch: ["packages/react/src/index.ts", "packages/html/src/index.ts", "metadata/"],
    buildFree: true,
    ssot: true,
  },
  {
    id: "tds-coverage-pointers",
    label: "TDS coverage 포인터 무결성 (metadata/tdsComponents.json nds → 실제 export)",
    check: ["node", "scripts/check-tds-coverage-pointers.mjs"],
    fix: null,
    fixHint:
      "리네임이면 metadata/tdsComponents.json 의 nds 를 현재 export 이름으로 수정, " +
      '미구현 목표면 nds 를 "" 로 비워 갭으로 표시하세요.',
    watch: [
      "metadata/tdsComponents.json",
      "packages/react/src/index.ts",
      "packages/html/src/index.ts",
    ],
    buildFree: true,
    ssot: true,
  },
  {
    id: "icon-catalog",
    label: "icon catalog SSOT (metadata/iconCatalog.json ← @nudge-design/icons 배럴)",
    check: ["node", "scripts/generate-icon-catalog.mjs", "--check"],
    fix: ["node", "scripts/generate-icon-catalog.mjs"],
    watch: [
      "packages/icons/src/index.ts",
      "metadata/iconCatalog.json",
      "scripts/generate-icon-catalog.mjs",
    ],
    buildFree: true, // packages/icons/src/index.ts 소스 텍스트를 직접 파싱 — dist 불필요
    ssot: true,
  },
  {
    id: "icon-naming",
    label: "아이콘 파일명 명명 규칙 (kebab·철자·-solid·*-circle)",
    check: ["node", "scripts/check-icon-naming.mjs"],
    fix: null,
    fixHint:
      "svg 파일명을 packages/icons/README.md '명명 규칙' 에 맞춰 rename + 소비처(guides.ts 등) " +
      "동기화 + changeset(minor) + pnpm fix. 의도된 예외는 scripts/icon-naming-baseline.json 에 등재.",
    watch: [
      "packages/icons/svg/",
      "scripts/check-icon-naming.mjs",
      "scripts/icon-naming-baseline.json",
    ],
    buildFree: true, // svg 파일명만 읽음 — dist 불필요
    ssot: true,
  },
  {
    id: "guide-docs",
    label: "guide markdown docs",
    check: ["node", "scripts/generate-guide-docs.mjs", "--check"],
    fix: ["node", "scripts/generate-guide-docs.mjs"],
    watch: ["packages/mcp/src/guides.ts", "packages/mcp/guides-src/"],
    buildFree: false, // packages/mcp/dist/guides.js 를 읽음
    ssot: true,
  },
  {
    id: "component-docs",
    label: "컴포넌트 Props 표 (docs/components/*.mdx ← react Props 인터페이스)",
    check: ["node", "scripts/generate-component-docs.mjs", "--check"],
    fix: ["node", "scripts/generate-component-docs.mjs"],
    watch: ["packages/react/src/", "docs/components/", "scripts/component-docs-baseline.json"],
    buildFree: true, // packages/react/src/*.tsx 소스를 직접 파싱 — dist 불필요
    ssot: true,
  },
  {
    id: "semantic-tokens-doc",
    label: "시멘틱 토큰 카탈로그 문서 (docs/semantic-tokens.mdx)",
    check: ["node", "scripts/generate-semantic-tokens-doc.mjs", "--check"],
    fix: ["node", "scripts/generate-semantic-tokens-doc.mjs"],
    watch: ["packages/tokens/src/", "docs/semantic-tokens.mdx"],
    buildFree: false, // packages/tokens/dist/*.css 를 읽음 — stale dist 오탐 방지
    ssot: true,
  },
  {
    id: "mcp-tools-reference",
    label: "MCP tools reference",
    check: ["node", "scripts/generate-mcp-tools-reference.mjs", "--check"],
    fix: ["node", "scripts/generate-mcp-tools-reference.mjs"],
    watch: ["packages/mcp/src/tools/registry.ts"],
    buildFree: true,
    ssot: true,
  },

  // ── 루트 lint 체인의 나머지 게이트 (check-ssot 밖) ───────────────────────
  {
    id: "actions-layout",
    label: "brand actionsLayout 정의",
    check: ["node", "scripts/check-actions-layout.mjs"],
    fix: null,
    fixHint: "packages/tokens/src/brands/<brand>.ts 에 actionsLayout('split'|'end') 추가.",
    watch: ["packages/tokens/src/brands/"],
    buildFree: true,
    ssot: false,
  },
  {
    id: "input-token-binding",
    label: "입력 계열 --nds-input-* 토큰 바인딩",
    check: ["node", "scripts/check-input-token-binding.mjs"],
    fix: null,
    fixHint: "입력 계열 styles 는 --nds-input-* 슬롯을 공유해야 합니다 (brand drift 방지).",
    watch: ["packages/styles/src/"],
    buildFree: true,
    ssot: false,
  },
  {
    id: "runtime-registry",
    label: "html runtime.ts 등록 누락",
    check: ["node", "scripts/check-runtime-registry.mjs"],
    fix: null,
    fixHint: "packages/html/src/runtime.ts 에 새 nds-* 컴포넌트 import 를 추가하세요.",
    watch: ["packages/html/src/"],
    buildFree: true,
    ssot: false,
  },
  {
    id: "tokens-sync",
    label: "DESIGN.md ↔ tokens src 동기화",
    check: ["node", "scripts/sync-tokens.mjs", "--check"],
    fix: ["node", "scripts/sync-tokens.mjs", "--write"],
    watch: ["DESIGN.md", "packages/tokens/src/"],
    buildFree: true,
    ssot: false,
  },
  {
    id: "version-docs",
    label: "docs 버전 문자열 동기화",
    check: ["node", "scripts/sync-version-docs.mjs", "--check"],
    fix: ["node", "scripts/sync-version-docs.mjs"],
    watch: ["package.json", "packages/", "docs/"],
    buildFree: true,
    ssot: false,
    precommitSkip: true, // watch 가 너무 넓어 pre-commit 노이즈 — fix-all/CI 에서만
  },
  {
    id: "mcpb-version",
    label: "MCPB manifest 버전 미러",
    check: ["node", "scripts/sync-mcpb-version.mjs", "--check"],
    fix: ["node", "scripts/sync-mcpb-version.mjs"],
    watch: [
      "packages/react/package.json",
      "packages/tokens/package.json",
      "packages/icons/package.json",
      "packages/tailwind-preset/package.json",
      "packages/mcp/manifest.json",
      "package.json",
    ],
    buildFree: true,
    ssot: false,
  },
  {
    id: "skills-sync",
    label: "스킬 미러 (.claude → .agents)",
    check: ["node", "scripts/sync-skills.mjs", "--check"],
    fix: ["node", "scripts/sync-skills.mjs"],
    watch: [".claude/skills/", ".agents/skills/"],
    buildFree: true,
    ssot: false,
  },
  {
    id: "guide-figma-links",
    label: "컴포넌트 가이드 figmaNodeUrl (신규 누락 차단 + 기존 waiver 경고)",
    check: ["node", "scripts/check-guide-figma-links.mjs"],
    fix: null,
    fixHint:
      "guides-src/components/<Name>.md frontmatter 에 figmaNodeUrl 을 추가하세요. " +
      "기존 누락 정리는 scripts/guide-figma-baseline.json 에서 추적.",
    watch: ["packages/mcp/guides-src/components/", "scripts/guide-figma-baseline.json"],
    buildFree: true,
    ssot: true,
  },
  {
    id: "agents-md",
    label: "AGENTS.md 미러 (CLAUDE.md → AGENTS.md)",
    check: ["node", "scripts/sync-agents-md.mjs", "--check"],
    fix: ["node", "scripts/sync-agents-md.mjs"],
    watch: ["CLAUDE.md", "AGENTS.md"],
    buildFree: true,
    ssot: true,
  },
];

/** precommit-gate 대상: 소스만 읽고(buildFree) 명시적으로 제외되지 않은 게이트. */
export function precommitGates() {
  return GATES.filter((g) => g.buildFree && !g.precommitSkip);
}

/** staged 경로 목록에 매칭되는 게이트 선별. */
export function gatesForPaths(gates, paths) {
  return gates.filter((g) =>
    g.watch.some((prefix) => paths.some((p) => p === prefix || p.startsWith(prefix))),
  );
}
