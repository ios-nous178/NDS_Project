/**
 * tools/guides.ts — 디자인 가이드 · 원칙 · 어드민/CMS · CLAUDE.md 템플릿
 *
 * server.ts 에서 분리된 read-only tool 핸들러 묶음. 외부 상태에 의존하지 않고
 * `./guides.js` 에서 import 한 정적 데이터(COMPONENT_GUIDES, DESIGN_PRINCIPLES 등)
 * 와 사용자 입력만 받아 응답을 만들기 때문에 server 부트스트랩과 무관하게 단위
 * 테스트가 가능하다.
 */
import fs from "node:fs";
import path from "node:path";
import {
  COMPONENT_GUIDES,
  DESIGN_PRINCIPLES,
  PATTERN_GUIDES,
  ADMIN_CMS_GUIDE,
  SCOPE_ADVISORY,
  UX_WRITING_GUIDE,
  detectIntentFromText,
} from "../guides.js";

export const ENTRY_TOOL_ADVISORY =
  "이 MCP의 역할은 '별도 외부 목업 프로젝트를 빌드하고 목업을 생성하는 것'입니다. " +
  "DS 레포 소스 수정, git commit/push, GitHub 레포 변경, npm publish 같은 작업은 이 MCP의 역할이 아닙니다. " +
  "사용자가 그런 작업을 요청하면 DS 레포에서 직접 작업하라고 안내하세요. " +
  "이 MCP는 사용자 앱(Trost / Geniet / NudgeEAP) 컴포넌트만 노출합니다. " +
  "어드민/CMS/운영툴/백오피스 화면이라면 antd v5를 쓰고 get_guide({ topic: 'admin-cms' })를 호출하세요. " +
  "두 디자인시스템을 한 화면에서 섞어쓰지 마세요.";

export function getScopeAdvisory() {
  return SCOPE_ADVISORY;
}

export function getDesignPrinciples() {
  return { _advisory: ENTRY_TOOL_ADVISORY, ...DESIGN_PRINCIPLES };
}

export function getDosAndDonts() {
  return {
    _advisory: ENTRY_TOOL_ADVISORY,
    dos: DESIGN_PRINCIPLES.dos,
    donts: DESIGN_PRINCIPLES.donts,
  };
}

export function getUxWritingGuide() {
  return {
    _advisory:
      "사용자에게 노출되는 모든 텍스트(버튼·라벨·placeholder·empty state·에러·다이얼로그)에 적용되는 보이스톤·문장 룰. EAP 멘탈케어 도메인 규칙은 eapDomain 섹션을 함께 보세요. CTA 라벨 규칙은 get_guide({ topic: 'pattern:cta-group' }) 와도 일관.",
    ...UX_WRITING_GUIDE,
  };
}

export function getComponentGuide(name: string) {
  const guide = COMPONENT_GUIDES[name];
  if (!guide) {
    return {
      error: `No curated guide for '${name}'. Falls back to get_component(name) for raw props.`,
      knownGuides: Object.keys(COMPONENT_GUIDES),
    };
  }
  return {
    _advisory: guide.figmaNodeUrl
      ? "Figma 원본 노드 URL이 포함되어 있습니다. 픽셀/색/매트릭스가 의심되면 figmaNodeUrl 을 확인하세요."
      : "이 가이드는 아직 Figma 노드와 연결되지 않았습니다. list_figma_sync_status 로 다른 컴포넌트의 sync 상태를 확인할 수 있습니다.",
    ...guide,
  };
}

export function getPatternGuide(name: string) {
  const guide = PATTERN_GUIDES[name];
  if (!guide) {
    return {
      error: `No pattern guide for '${name}'.`,
      knownGuides: Object.keys(PATTERN_GUIDES),
    };
  }
  return {
    _advisory:
      "컴포넌트 API가 아니라 배치/위계/강조 사용량 기준입니다. 목업 작성 전 또는 validate_mockup 경고 수정 시 참고하세요.",
    ...guide,
  };
}

export function listFigmaSyncStatus() {
  const entries = Object.values(COMPONENT_GUIDES).map((g) => ({
    name: g.name,
    hasFigmaUrl: Boolean(g.figmaNodeUrl),
    figmaNodeUrl: g.figmaNodeUrl ?? null,
    hasSizeMatrix: Boolean(g.sizeMatrix),
    hasStateMatrix: Boolean(g.stateMatrix),
    hasColorMatrix: Boolean(g.colorMatrix),
    hasAccessibility: Boolean(g.accessibility?.length),
  }));
  const synced = entries.filter((e) => e.hasFigmaUrl);
  return {
    _advisory:
      "Figma Library(MqR7O3uvBvH5tVngwzbqGH) 와 sync 된 컴포넌트 목록. " +
      "hasFigmaUrl=true 인 항목은 get_guide({ topic: 'component:<Name>' }) 응답에서 figmaNodeUrl 을 바로 클릭할 수 있습니다.",
    total: entries.length,
    syncedCount: synced.length,
    pendingCount: entries.length - synced.length,
    entries,
  };
}

export function getAdminCmsGuide(args: { intent?: string }) {
  return {
    intent: "admin-cms",
    note:
      "어드민/CMS 화면을 만들 때 따라야 할 시각/구조 컨벤션. " +
      "이 가이드는 NudgeEAPCMS(antd 5.5.1) 실제 운영 코드에서 추출했습니다.",
    detectedKeyword:
      args.intent && detectIntentFromText(args.intent) === "admin-cms"
        ? "admin-cms 의도로 인식됨"
        : undefined,
    ...ADMIN_CMS_GUIDE,
  };
}

/* ───────────── get_guide 라우터 ─────────────
 *
 * 8개로 흩어져 있던 가이드 도구를 단일 진입점으로 통합.
 * topic 포맷:
 *   - "principles" | "dos-donts" | "admin-cms" | "scope-advisory" | "inspector-setup"
 *   - "component:<Name>" — 예: "component:Button"
 *   - "pattern:<name>"   — 예: "pattern:cta-group"
 *
 * 알 수 없는 topic 은 사용 가능한 목록을 함께 돌려준다.
 */

export const GUIDE_FIXED_TOPICS = [
  "principles",
  "dos-donts",
  "ux-writing",
  "admin-cms",
  "scope-advisory",
  "inspector-setup",
] as const;

export type GuideTopic =
  | (typeof GUIDE_FIXED_TOPICS)[number]
  | `component:${string}`
  | `pattern:${string}`;

function listGuideTopics() {
  return {
    fixed: [...GUIDE_FIXED_TOPICS],
    componentExamples: Object.keys(COMPONENT_GUIDES)
      .slice(0, 6)
      .map((n) => `component:${n}`),
    patternExamples: Object.keys(PATTERN_GUIDES).map((n) => `pattern:${n}`),
    componentTopics: Object.keys(COMPONENT_GUIDES).map((n) => `component:${n}`),
    patternTopics: Object.keys(PATTERN_GUIDES).map((n) => `pattern:${n}`),
  };
}

export function getGuide(args: { topic: string; intent?: string }) {
  const topic = args.topic;
  if (typeof topic !== "string" || topic.length === 0) {
    return {
      error: "get_guide: 'topic' must be a non-empty string.",
      availableTopics: listGuideTopics(),
    };
  }

  if (topic.startsWith("component:")) {
    const name = topic.slice("component:".length);
    if (!name) {
      return {
        error: "component:<Name> 형식이어야 합니다. 예: component:Button",
        availableTopics: listGuideTopics(),
      };
    }
    return getComponentGuide(name);
  }
  if (topic.startsWith("pattern:")) {
    const name = topic.slice("pattern:".length);
    if (!name) {
      return {
        error: "pattern:<name> 형식이어야 합니다. 예: pattern:cta-group",
        availableTopics: listGuideTopics(),
      };
    }
    return getPatternGuide(name);
  }

  switch (topic) {
    case "principles":
      return getDesignPrinciples();
    case "dos-donts":
      return getDosAndDonts();
    case "ux-writing":
      return getUxWritingGuide();
    case "admin-cms":
      return getAdminCmsGuide({ intent: args.intent });
    case "scope-advisory":
      return getScopeAdvisory();
    case "inspector-setup":
      return getInspectorSetup();
    default:
      return {
        error: `Unknown guide topic: '${topic}'.`,
        availableTopics: listGuideTopics(),
      };
  }
}

export function getInspectorSetup() {
  return {
    summary:
      "외부 mockup 프로젝트의 dev 화면 우하단에 floating 버튼을 띄워, DS / antd / native 요소를 색깔별로 outline + 카운트로 시각화. Ctrl/Cmd+Shift+D 토글. dev-only.",
    rationale:
      "AI 생성 화면이 'DS 적용처럼 보이지만 실은 antd/native 잔존' 인지 사용자가 한눈에 검증할 수 있게 함. validate_mockup 의 정적 검증과 보완 — 정적 검증은 코드를, Inspector 는 런타임 DOM 을 봄.",
    package: "@nudge-eap/react",
    subpath: "@nudge-eap/react/inspector",
    install:
      "이미 @nudge-eap/react 가 설치돼 있다면 추가 설치 불필요. subpath export 로 inspector 만 분리되어 있어 tree-shake 가능.",
    setup: {
      file: "src/main.tsx (또는 App.tsx 의 최상단 레벨)",
      action: "DsInspector 를 import 해서 dev 모드에서만 렌더. production 빌드에는 자동 제외.",
      code: `import { DsInspector } from "@nudge-eap/react/inspector";

// 기존 App 옆에 dev-only 로 렌더
function Root() {
  return (
    <>
      <App />
      {import.meta.env.DEV ? <DsInspector /> : null}
    </>
  );
}`,
    },
    usage: [
      "dev 화면 우하단 'DS Inspector' 버튼 클릭 (또는 Ctrl/Cmd+Shift+D)",
      "Inspector 패널 펼침: DS(초록) / antd(주황) / native(빨강) 카운트 + 총합 + DS 비율 (%) 표시",
      "'outline 표시' 체크박스 켜면 각 요소에 분류별 outline 표시 (DS=실선 초록, antd=실선 주황, native=점선 빨강)",
      "DS 비율 낮거나 antd/native 가 보이면 → validate_mockup 으로 정적 검증 + 코드 재구성",
    ],
    classification: {
      ds: "className 에 `nds-` prefix → @nudge-eap/react 컴포넌트",
      antd: "className 에 `ant-` prefix → antd 컴포넌트 (user-app 에서는 변환 미완료 신호)",
      native: "<button>, <input>, <select>, <textarea>, <form>, <label> 등 raw HTML primitive",
    },
    note: "분류는 DOM className 기반이라 React 컴포넌트 트리가 아니라 *렌더된 결과* 기준입니다. styled-components / emotion 으로 nds-* 클래스를 덮어쓰면 DS 로 인식 안 될 수 있어요.",
  };
}

export function getClaudeMdTemplate(args: {
  projectName?: string;
  intent?: "user-app" | "admin-cms";
}) {
  const title = args.projectName ? `# ${args.projectName}` : "# NudgeEAP Mockup Workspace";

  if (args.intent === "admin-cms") {
    return `${title}

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 목업 프로젝트 빌드 + 목업 생성**이다.
- **하지 말 것**: NudgeEAP DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.
- 이 프로젝트는 DS를 '소비'하는 쪽이고, DS 레포는 별도로 관리된다.

## 분기 — 이 프로젝트는 어드민/CMS 목업이다

- 사용 라이브러리: **antd v5** (NudgeEAPCMS 기준 5.5.1) + @ant-design/icons + dayjs(ko)
- **금지**: \`@nudge-eap/react\`, \`@nudge-eap/tokens\`, \`@nudge-eap/icons\` 어떤 형태로도 import하지 말 것
- nudge-eap-ds MCP는 두 가지 도구만 사용:
  - \`get_guide({ topic: "admin-cms" })\` — 사이드바/페이지 헤더/검색 폼/테이블/색상 등 전체 시각 컨벤션
  - \`start_dev_server\` / \`check_preview\` / \`stop_dev_server\` — 어드민에서도 동일하게 사용 가능

## 작업 원칙

- 어드민은 정보 밀도가 높고 스캔하기 쉬운 레이아웃이 우선. 마케팅/장식 톤 금지.
- antd 컴포넌트를 직접 만들지 말고 그대로 사용 (\`Button\`, \`Form\`, \`Input\`, \`Select\`, \`DatePicker\`, \`Table\`, \`Modal\`, \`Tabs\`, \`Tag\`, \`Space\`, \`Card\`, \`Pagination\`).
- 색/타이포/외형은 antd 기본값 유지. \`ConfigProvider\` 토큰은 색·폰트·라디우스 정도만.

## 시각 컨벤션 (NudgeEAPCMS 기반)

- **사이더**: 240px 라이트, \`border-right: 1px solid #ececec\`, 상단 6px 브랜드 액센트(#2B96ED)
- **사이더 내부**: \`INFO\` 블록(이메일+이름 Tag+권한 Tag) → \`CMS MENU\` 블록(<Menu theme="light" mode="inline">) → \`SETTING\` 블록(로그아웃/정보수정)
- **메뉴 선택**: \`border-right: 6px solid #2B96ED\`
- **본문**: \`margin-left: 240px\`, \`padding: 40px 60px 200px\`
- **body bg**: \`#f4f4f4\`, **font**: \`Mulish, Gothic_A1, 'Malgun Gothic', '맑은 고딕'\`
- **HeaderSubject**: Breadcrumb \`separator=">"\` + h1 22/700 #383838 + desc 12/#6b6a6a + \`border-bottom: 1px solid #e4e4e4\`
- **검색 폼**: \`Form\` 안 \`Select(100px) + Input.Search(enterButton="검색") + 초기화 Button\` / 우측 액션 / 하단 "검색된 개수: N"
- **Table**: \`size="middle"\`, 컬럼 거의 모두 \`align: "center"\`, 클릭 가능한 셀은 \`<Button type="link">\`, \`pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false }}\`
- **Status Tag**: \`width: 60px; text-align: center;\` (TagAdminRole 컨벤션)
- **푸터**: \`Copyright © Nudge EAP. All Rights Reserved.\` (12px / #b1b1b1 / border-top #ececec)

자세한 코드 예시는 \`get_guide({ topic: "admin-cms" })\`를 호출해 가져오세요.

## 검증 루프

1. \`get_guide({ topic: "admin-cms" })\` 호출해 컨벤션 재확인
2. AdminLayout(Sider+Content+Footer) → 페이지 작성
3. \`tsc --noEmit\` 통과
4. \`start_dev_server\` → \`check_preview\` → 에러 0건 확인
5. \`stop_dev_server\`

## Self-Check

- [ ] antd에서 import (직접 button/input/select 만들지 않음)
- [ ] @nudge-eap/* 어떤 패키지도 import하지 않음
- [ ] 사이드바 라이트 240px + 6px 톱 액센트 + INFO/CMS MENU/SETTING 블록 있음
- [ ] HeaderSubject + 검색 폼(Select+Input.Search+초기화) + Table(align center+Button.link) 패턴 일관
- [ ] body \`#f4f4f4\` + 본문 \`padding: 40 60 200\` + 푸터 카피 있음
- [ ] tsc --noEmit 통과
`;
  }

  return `${title}

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 목업 프로젝트 빌드 + 목업 생성**이다.
- **하지 말 것**: NudgeEAP DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.
- 이 프로젝트는 DS를 '소비'하는 쪽이고, DS 레포는 별도로 관리된다.

## 분기 (먼저 확인)

- **어드민/CMS/운영툴/백오피스 화면이라면 이 CLAUDE.md를 따르지 말 것.**
  \`get_setup({ step: "claude-md", intent: "admin-cms" })\` 도구로 다시 호출해 어드민용 가이드를 받으세요.
  어드민에는 antd v5를 사용하고 \`get_guide({ topic: "admin-cms" })\`로 컨벤션을 확인합니다.
- 이 가이드는 사용자 앱(Trost/Geniet/NudgeEAP) 화면용입니다.

## 작업 원칙

- 이 프로젝트는 NudgeEAP Design System 기반 사용자 앱 목업 작업 공간이다.
- DS 컴포넌트/아이콘/토큰을 추측해서 사용하지 말고, MCP 도구로 확인한 뒤 사용한다.
- 구현 완료의 기준은 코드 작성이 아니라 실제 dev 화면이 에러 없이 렌더링되는 것이다.

## 도구 사용 규칙

- **목업 작업을 시작하기 전 반드시 \`get_guide({ topic: "principles" })\` 호출** — 브랜드 톤·컬러 시멘틱·타이포·스페이싱·금지 패턴을 한 번에 로드. 브랜드를 바꾸면 재호출.
- 시각 기준이 중요한 화면은 \`get_guide({ topic: "pattern:visual-reference" })\` 호출. 프롬프트에 이미지/Figma 링크가 있으면 그것을 기준으로 쓰고, 없으면 사용자에게 정답/오답 스크린샷 또는 Figma 링크를 요청한다.
- 컴포넌트/아이콘/토큰 사용 전 \`search_component\` / \`find_icon\` / \`lookup_token\` 호출
- 처음 쓰는 주요 컴포넌트는 \`get_guide({ topic: "component:Button" })\` 형식으로 호출
- CTA 그룹, 아이콘 컬러·사용처, 시멘틱 spacing(--gap-* / --inset-*), surface 레이어·brand bg 사용, 시각 레퍼런스, 시각 안티패턴, 안내문 강조, 옵션 많은 드롭다운, 정보 과밀 리스트, 다크패턴(진입 직후 시트·뒤로가기 인터럽트·거절 불가 CTA·중간 광고·라벨 모호성)은 \`get_guide({ topic: "pattern:semantic-spacing" })\` / \`get_guide({ topic: "pattern:surface-layer" })\` / \`get_guide({ topic: "pattern:icon-usage" })\` / \`get_guide({ topic: "pattern:cta-group" })\` / \`get_guide({ topic: "pattern:dark-patterns" })\` 형식으로 호출
- **사용자 노출 텍스트(버튼·라벨·placeholder·empty state·에러·다이얼로그)는 작성 전 \`get_guide({ topic: "ux-writing" })\` 호출** — 해요체·능동형·긍정형·캐주얼 경어·"닫기 vs 취소" 같은 마이크로카피 규칙 + EAP 멘탈케어 도메인 규칙(위기·자해·진단 표현 톤)을 한 번에 로드.
- 워크스페이스 첫 셋업 시 **\`get_setup({ step: "inspector" })\` 한 번 호출** — MCP 가 src/main.tsx 를 직접 패치해 DsInspector 를 dev-only 로 마운트합니다 (idempotent). 성공 후 dev 서버 재시작하면 우하단 floating 버튼으로 DS / antd / native 비율을 실시간 확인 가능 (Ctrl/Cmd+Shift+D 토글). 별도 코드 수정 불필요.
- 목업 \`.tsx\` 작성 직후 반드시 \`validate_mockup\` 호출
- 위반이 있으면 \`suggest_replacement\`로 수정 후 재검증, 최대 3회 루프
- **\`validate_mockup\` 통과 후 반드시 \`npx tsc --noEmit\` 실행** — validate_mockup 은 패턴 검사만 하므로 잘못된 prop union 값(\`IconButton size="md"\` → 유효: x-large/large/medium/small, \`Card variant="content"\` → 유효: outlined/elevated/flat 등)은 못 잡습니다. Vite dev 서버도 esbuild 변환이라 타입 에러를 무시함. tsc 가 0 errors 되어야 다음 단계로.
- 구현 후 \`start_dev_server\`로 dev 서버 실행
- dev URL이 응답하면 \`check_preview\`로 런타임 에러, Vite overlay, 빈 화면 여부 확인
- \`check_preview.ok === false\`이면 에러를 수정하고 다시 \`check_preview\`
- 완료 전 \`get_guide({ topic: "dos-donts" })\`로 최종 sanity check
- 목업 \`.tsx\` 가 완성/수정될 때마다 **반드시 \`report_mockup_usage({ filePath: '<mockup경로.tsx>' })\` 호출** — 로컬 \`.ds-usage-log.jsonl\` 적재 + 공용 Google Sheets webhook으로 자동 전송 (별도 인증/설정 불필요). 빠뜨리면 사용량 집계가 비어 보임.
- **최종 산출물은 항상 단일 HTML 파일**. mockup 완성 후 **반드시 \`build_singlefile_html({})\` 호출** — 사용자에게 "만들까요" 라고 묻지 말 것. 그냥 실행하세요. 사용자가 명시적으로 "빌드하지 마" 라고 거부한 경우에만 생략. 손으로 .html 작성, \`vite build\` 직접 실행, 다른 번들러 사용, .tsx 만 남기고 종료 — **모두 금지**.
- 작업 종료 시 MCP가 띄운 서버는 \`stop_dev_server\`로 종료

## UI 구현 규칙

- 가능한 한 DS 컴포넌트를 우선 사용한다.
- **기존 antd/HTML 코드를 받았을 때 변수명만 치환하지 말 것**. 색상값을 \`var(--...)\` 로 바꾸는 것만으론 "DS 적용"이 아니다. antd \`<Table>\` → DS \`<DataTable>\`, antd \`<Form>\` → DS \`Input\`/\`Select\` 조합 식으로 **컴포넌트 구조를 처음부터 재구성**한다. 한 줄이라도 antd import 가 남아 있으면 변환 미완료로 본다 (validate_mockup 의 \`antd-import-in-user-app\` 으로 자동 검출됨).
- raw \`button\`, \`input\`, \`select\`, \`textarea\`는 특별한 이유가 없으면 사용하지 않는다.
- **이모지·텍스트 기호 절대 금지**. 라벨/버튼/제목/placeholder/empty state 어디에도 이모지(😀 🔥 ⭐ 💡 ✅ ⚠️ 등) 박지 말 것. → ← ✓ ★ • 같은 기호 텍스트도 금지. 아이콘이 필요하면 \`find_icon\` 으로 \`@nudge-eap/icons\` 에서 찾고, 없으면 인라인 SVG. 진행/별점/불릿은 DS 컴포넌트 사용. \`validate_mockup\` 의 \`emoji-banned\` / \`text-symbol-banned\` 룰로 자동 위반 카운트됨.
- 색상/간격은 인라인 hex, rgb, px 값보다 DS 토큰을 우선 사용한다.
- 인라인 SVG를 직접 만들기보다 \`@nudge-eap/icons\` 아이콘을 사용한다.
- 그라데이션, 과한 장식 배경, 중첩 카드 구조는 피한다.
- 우측 화살표 아이콘은 대표 전진 CTA 1개에만 사용하고 반복 CTA에는 붙이지 않는다.
- 단독 아이콘은 기본 currentColor에 기대지 말고 주변 UI에 맞는 토큰 컬러를 명시한다.
- 브랜드 모드(\`brand='geniet'\`/\`'trost'\`)에서 작업할 때는 해당 브랜드 prefix 아이콘(예: \`GenietRecordOnIcon\`, \`GenietGpointIcon\`)을 공용 아이콘보다 **우선 사용**. 매칭 가능한 brand 아이콘 목록은 \`get_brand_info(slug).brandIcons\` 로 조회. 공통 컴포넌트(AppFooter/BottomNav 등)의 *구현* 안에 \`if (brand === ...)\` 분기를 박지 말고, 브랜드 전용 화면이 명시적으로 import 해서 icon prop 으로 전달.
- primary solid 버튼은 한 화면의 대표 액션 1개만 사용한다.
- Chip/Badge는 상태, 분류, 짧은 속성 표시용으로만 사용하고 안내문/섹션 장식으로 남발하지 않는다.
- 안내 영역은 neutral surface를 기본으로 하고 색 배경/아이콘/Chip/Badge/굵은 제목 중 1~2개만 조합한다.
- 모든 클릭 가능한 요소는 목업이어도 \`onClick\` 동작을 갖는다.

## 검증 루프

1. DS 원칙 확인: \`get_guide({ topic: "principles" })\`
2. 필요한 컴포넌트/아이콘/토큰 검색
3. 필요한 UX 패턴 확인: \`get_guide({ topic: "pattern:<name>" })\`
4. 목업 구현
5. \`validate_mockup\` 실행 — **응답의 \`summary.checklistReport\` (Self-Check 5항목 결과) 를 코드 아래에 그대로 사용자에게 보여줄 것**. 5항목: ① Spacing 토큰 사용 ② 4pt Grid 준수 ③ Brand BG 1개 이하 ④ 헤딩 장식 아이콘 없음 ⑤ Primary Button 단일성 (영역별). 위반이 1건이라도 있으면 수정 후 재실행.
5-bis. **2회 self-check 강제** — 1회차에서 위반이 없었거나 수정해서 0건이 됐어도, \`validate_mockup\` 을 **반드시 한 번 더** 호출해 2회차 결과까지 0건임을 확인. 1회차 통과만 보고 다음 단계로 넘어가는 것 금지 (수정 과정에서 새 위반이 들어올 수 있음). 위반을 인지하고 그대로 제출하는 것도 금지.
5.5. **\`npx tsc --noEmit\` 실행** — invalid prop union(예: \`size="md"\` while only x-large|large|medium|small) 등 validate_mockup 이 못 잡는 타입 에러를 여기서 차단. 0 errors 가 되어야 다음 단계.
6. \`start_dev_server\` 실행
7. \`check_preview\` 실행 및 런타임 오류 수정
8. (선택) Inspector 가 셋업돼 있으면 화면 우하단 패널에서 DS 비율 / antd·native 잔존 여부 확인. 미셋업이면 \`get_setup({ step: "inspector" })\` 한 번 호출(자동 패치).
9. \`get_guide({ topic: "dos-donts" })\` 로 최종 확인
10. **\`report_mockup_usage({ filePath: '<mockup경로.tsx>' })\` 호출** — 사용량 집계 적재 (생략 금지). 응답의 \`humanReadable\` 한 줄을 **사용자에게 반드시 보여줄 것**.
11. **단일 HTML 산출물 빌드 (기본 동작 — 물어보지 말 것)**:
    - dev 서버 미리보기 URL 을 명확히 보여주고 직접 확인 권유 (Claude 가 URL 전달을 종종 빠뜨림 — 이 단계 생략 금지).
    - 이 워크스페이스의 **표준 산출물 형식은 단일 HTML 파일**입니다. mockup 작성 후 **반드시 \`build_singlefile_html({})\` 호출** — 사용자에게 "만들어 드릴까요" 라고 묻지 말 것. 그냥 실행하세요.
    - 사용자가 명시적으로 "빌드하지 마" / "TSX 만 줘" / "HTML 필요 없어" 라고 거부한 경우에만 생략 가능.
    - **다른 출력 방식 모두 금지**: 손으로 .html 작성, \`vite build\` 직접 실행, esbuild/parcel/webpack 사용, .tsx 만 남기고 종료 — 모두 금지. nds-* 클래스와 onClick 인터랙션이 손실됨.
    - 빌드 후 \`dist/index.html\` 경로와 파일 크기를 사용자에게 알릴 것 — 이게 슬랙/메일 공유용 최종 산출물입니다.
12. 사용자가 검토를 마치면 \`stop_dev_server\` 로 종료.
`;
}

export function createClaudeMd(args: {
  cwd?: string;
  projectName?: string;
  overwrite?: boolean;
  intent?: string;
}) {
  const cwd = path.resolve(args.cwd ?? process.cwd());
  if (!fs.existsSync(cwd)) {
    return { ok: false, error: `cwd not found: ${cwd}` };
  }

  const filePath = path.join(cwd, "CLAUDE.md");
  const exists = fs.existsSync(filePath);
  if (exists && !args.overwrite) {
    return {
      ok: false,
      filePath,
      exists: true,
      error: "CLAUDE.md already exists. Pass overwrite: true to replace it.",
      preview: fs.readFileSync(filePath, "utf-8").slice(0, 1200),
    };
  }

  const detected = detectIntentFromText(args.intent);
  const intent: "user-app" | "admin-cms" =
    args.intent === "admin-cms" || detected === "admin-cms" ? "admin-cms" : "user-app";

  const content = getClaudeMdTemplate({ projectName: args.projectName, intent });
  fs.writeFileSync(filePath, content, "utf-8");

  return {
    ok: true,
    filePath,
    overwritten: exists,
    bytes: Buffer.byteLength(content, "utf-8"),
    intent,
    next: "Restart or reload Claude Code in this project so the new CLAUDE.md instructions are picked up.",
  };
}
