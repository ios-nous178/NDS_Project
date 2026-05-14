import fs from "node:fs";

export interface MockupValidationContext {
  tokenSet: Set<string>;
  componentNames: Set<string>;
  iconSet: Set<string>;
}

const EMPTY_VALIDATION_CONTEXT: MockupValidationContext = {
  tokenSet: new Set(),
  componentNames: new Set(),
  iconSet: new Set(),
};

let configuredContext: MockupValidationContext = EMPTY_VALIDATION_CONTEXT;

export function configureMockupValidator(context: MockupValidationContext) {
  configuredContext = context;
}

function getValidationContext(context?: MockupValidationContext) {
  return context ?? configuredContext;
}

export interface Violation {
  rule: string;
  line: number;
  detail: string;
  suggestion?: string;
}

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function getJsxBlocks(
  source: string,
  componentName: string,
): Array<{ block: string; line: number }> {
  const blocks: Array<{ block: string; line: number }> = [];
  const pattern = new RegExp(
    `<\\s*${componentName}\\b[\\s\\S]*?(?:<\\/\\s*${componentName}\\s*>|\\/>)`,
    "g",
  );
  for (const match of source.matchAll(pattern)) {
    blocks.push({ block: match[0], line: lineNumberAt(source, match.index ?? 0) });
  }
  return blocks;
}

// Container 컴포넌트(Card.Root, Card.Footer 같이 자식 안에 self-closing JSX 가 많은 케이스)는
// 비탐욕 정규식이 자식의 `/>` 에서 끊겨 잘못된 블록을 잡는다. 같은 태그명만 LIFO 스택으로 페어링.
function getBalancedJsxBlocks(
  source: string,
  componentName: string,
): Array<{ block: string; line: number }> {
  const blocks: Array<{ block: string; line: number }> = [];
  const tagRe = new RegExp(`<(\\/?)\\s*${componentName}\\b[^>]*?(\\/?)>`, "g");
  const openStack: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(source)) !== null) {
    const isClose = m[1] === "/";
    const isSelfClose = m[2] === "/";
    if (isClose) {
      const start = openStack.pop();
      if (start !== undefined) {
        blocks.push({
          block: source.slice(start, tagRe.lastIndex),
          line: lineNumberAt(source, start),
        });
      }
    } else if (isSelfClose) {
      blocks.push({
        block: source.slice(m.index, tagRe.lastIndex),
        line: lineNumberAt(source, m.index),
      });
    } else {
      openStack.push(m.index);
    }
  }
  return blocks;
}

function getIconBlocks(source: string): Array<{ block: string; line: number; index: number }> {
  const blocks: Array<{ block: string; line: number; index: number }> = [];
  const pattern = /<\s*\w+Icon\b[\s\S]*?(?:\/>|>\s*<\/\s*\w+Icon\s*>)/g;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    blocks.push({ block: match[0], line: lineNumberAt(source, index), index });
  }
  return blocks;
}

export function validateMockupSource(
  source: string,
  options?: { intent?: "user-app" | "admin-cms"; context?: MockupValidationContext },
): Violation[] {
  const context = getValidationContext(options?.context);
  const violations: Violation[] = [];
  const lines = source.split("\n");
  const intent = options?.intent ?? "user-app";

  lines.forEach((line, i) => {
    const ln = i + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    // 1. 인라인 hex/rgb 색상
    if ((/#[0-9a-fA-F]{3,8}\b/.test(line) || /rgba?\s*\(/.test(line)) && !line.includes("var(--")) {
      violations.push({
        rule: "inline-color",
        line: ln,
        detail: line.trim(),
        suggestion: "토큰 CSS 변수(--color-*)로 교체. lookup_token 사용.",
      });
    }
    // 2. 인라인 px/rem (transform 류 제외, var(...) 안의 fallback 제외)
    {
      const stripped = line.replace(/var\([^)]*\)/g, "");
      if (
        /\b\d+(\.\d+)?(px|rem)\b/.test(stripped) &&
        !/transform|translate|scale|rotate|matrix/.test(stripped)
      ) {
        violations.push({
          rule: "inline-spacing",
          line: ln,
          detail: line.trim(),
          suggestion: "spacing 토큰으로 교체. lookup_token('spacing') 사용.",
        });
      }
    }
    // 3. native button/input/select
    if (
      /<\s*(button|input|select|textarea)[\s>/]/.test(line) &&
      !line.includes("// allow-native")
    ) {
      violations.push({
        rule: "native-element",
        line: ln,
        detail: line.trim(),
        suggestion: "DS 컴포넌트(Button/Input/Select 등)로 교체.",
      });
    }
    // 4. 인라인 SVG
    if (/<\s*svg[\s>]/.test(line)) {
      violations.push({
        rule: "inline-svg",
        line: ln,
        detail: line.trim(),
        suggestion:
          "먼저 find_icon으로 @nudge-eap/icons에 적합한 아이콘이 있는지 확인하세요. 없을 때만 인라인 SVG로 새로 그리는 것이 허용됩니다 (텍스트/이모지는 금지).",
      });
    }
    // 4-bis. 텍스트/이모지 아이콘 금지
    // 이모지(범위)와 흔한 아이콘용 기호(→ ← ↑ ↓ › ‹ » « ▶ ◀ ▲ ▼ ✓ ✗ ✘ × ✕ ★ ☆ ♥ ♡ ❤ • · ＋ －)를 JSX/문자열에서 검출
    {
      // 4-bis-1. 이모지 (Unicode emoji ranges + variation selector)
      const emojiPattern =
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]️?/u;
      if (emojiPattern.test(line)) {
        violations.push({
          rule: "text-icon-banned",
          line: ln,
          detail: line.trim(),
          suggestion:
            "이모지를 아이콘처럼 사용하지 마세요. find_icon으로 @nudge-eap/icons에서 적합한 아이콘을 찾고, 없으면 인라인 SVG로 새로 그리세요.",
        });
      }
      // 4-bis-2. 기호 아이콘 — JSX 텍스트 노드나 단독 문자열로 쓰인 경우만 (의미 문자 보호)
      // 패턴: `>‹`, `<span>→</span>`, `{"›"}`, `'×'` 식으로 1글자가 노출된 경우
      const symbolIconPattern =
        /(?:>\s*|{\s*["']|=\s*["'])([→←↑↓›‹»«▶◀▲▼✓✗✘×✕★☆⭐♥♡❤])\s*(?:["']\s*}|<\/|["'])/;
      if (symbolIconPattern.test(line)) {
        violations.push({
          rule: "text-icon-banned",
          line: ln,
          detail: line.trim(),
          suggestion:
            "→ ← ✓ × ★ 같은 기호 문자를 아이콘 대용으로 쓰지 마세요. find_icon으로 적합한 아이콘을 찾고, 없으면 인라인 SVG로 새로 그리세요.",
        });
      }
    }
    // 4-2. 그라데이션 (DESIGN.md 금지)
    if (/(linear|radial|conic)-gradient\s*\(/.test(line)) {
      violations.push({
        rule: "gradient-banned",
        line: ln,
        detail: line.trim(),
        suggestion:
          "그라데이션 금지. 단색 토큰(var(--color-*))만 사용. get_design_principles 참조.",
      });
    }
    // 4-3. Button color='assistive' variant='solid' 또는 default(solid)
    if (/<\s*Button\b/.test(line)) {
      const hasAssistive = /color\s*=\s*["']assistive["']/.test(line);
      const explicitlyNonSolid =
        /variant\s*=\s*["'](outlined|soft|outlined-sub|text|ghost)["']/.test(line);
      if (hasAssistive && !explicitlyNonSolid) {
        violations.push({
          rule: "assistive-solid-cta",
          line: ln,
          detail: line.trim(),
          suggestion:
            "Button color='assistive' + solid는 cool-gray 배경이라 비활성처럼 보임. 활성 CTA면 'primary' 또는 'secondary' 사용. get_component_guide('Button') 참조.",
        });
      }
    }
    // 4-4. Card 슬롯에 외곽 padding 추가 (이중 패딩 함정)
    if (
      /<\s*Card\.(Header|Body|Footer)\b/.test(line) &&
      /\bpadding(Top|Right|Bottom|Left)?\s*:/.test(line)
    ) {
      violations.push({
        rule: "card-slot-double-padding",
        line: ln,
        detail: line.trim(),
        suggestion:
          "Card.Header/Body/Footer는 자체 padding을 가짐. 외곽 padding을 또 주면 이중 패딩으로 어긋남. get_component_guide('Card') 참조.",
      });
    }
    // 5. 알 수 없는 토큰
    const tokenRefs = line.matchAll(/var\((--[\w-]+)\)/g);
    for (const m of tokenRefs) {
      if (!context.tokenSet.has(m[1])) {
        violations.push({
          rule: "unknown-token",
          line: ln,
          detail: m[1],
          suggestion: "lookup_token으로 올바른 토큰 검색.",
        });
      }
    }
  });

  // user-app intent 일 때 antd 임포트는 변환 미완료 신호 (admin-cms 의도면 정상이라 skip)
  if (intent === "user-app") {
    const antdImportRe = /import\s+(?:[\w*{}\s,]+\s+from\s+)?["']antd(?:\/[^"']+)?["']/g;
    for (const m of source.matchAll(antdImportRe)) {
      violations.push({
        rule: "antd-import-in-user-app",
        line: lineNumberAt(source, m.index ?? 0),
        detail: m[0].trim(),
        suggestion:
          "user-app 목업에 antd 임포트가 남아 있습니다. 변수명 치환이 아니라 DS 컴포넌트 구조로 *처음부터 재구성* 하세요 — `antd.Table` → `DataTable`, `antd.Button` → DS `Button`, `antd.Form` → DS `Input`/`Select` 조합. 한 임포트라도 남아 있으면 변환 미완료로 간주.",
      });
    }
  }

  // 6. import 검증 — 한 번만
  const importMatches = source.matchAll(
    /import\s*\{([^}]+)\}\s*from\s*["']@nudge-eap\/(react|icons)["']/g,
  );
  for (const m of importMatches) {
    const pkg = m[2] as "react" | "icons";
    const names = m[1]
      .split(",")
      .map((s) =>
        s
          .trim()
          .split(/\s+as\s+/)[0]
          .trim(),
      )
      .filter(Boolean);
    for (const name of names) {
      const allowed =
        pkg === "react" ? context.componentNames.has(name) : context.iconSet.has(name);
      if (!allowed) {
        violations.push({
          rule: `unknown-${pkg}-export`,
          line: 0,
          detail: name,
          suggestion:
            pkg === "react"
              ? `search_component('${name}')으로 유사 컴포넌트 확인.`
              : `find_icon('${name.replace(/Icon$/, "")}')으로 유사 아이콘 확인.`,
        });
      }
    }
  }

  const buttonBlocks = getJsxBlocks(source, "Button");
  const arrowButtonBlocks = buttonBlocks.filter(({ block }) =>
    /(?:Arrow(?:Next|Right)|ChevronRight)Icon|<\s*(?:ArrowNext|ChevronRight)Icon\b|[→›]/.test(
      block,
    ),
  );
  if (arrowButtonBlocks.length > 1) {
    violations.push({
      rule: "button-arrow-overuse",
      line: arrowButtonBlocks[1].line,
      detail: `Arrow/Chevron CTA가 ${arrowButtonBlocks.length}개 발견됨.`,
      suggestion:
        "우측 화살표는 대표 전진 CTA 1개에만 남기고 반복/보조 CTA에서는 제거. get_pattern_guide('cta-group') 참조.",
    });
  }
  for (const { block, line } of arrowButtonBlocks) {
    const before = source.slice(Math.max(0, source.indexOf(block) - 240), source.indexOf(block));
    if (
      /\.map\s*\(/.test(before) ||
      /variant\s*=\s*["'](outlined|outlined-sub|soft|text|ghost)["']/.test(block)
    ) {
      violations.push({
        rule: "button-arrow-secondary-or-repeated",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "반복 리스트나 보조 variant CTA에는 화살표를 붙이지 않는 편이 자연스럽습니다. 대표 primary CTA 1개에만 사용하세요.",
      });
    }
  }

  const primarySolidButtons = buttonBlocks.filter(({ block }) => {
    const hasPrimary = /color\s*=\s*["']primary["']/.test(block) || !/color\s*=/.test(block);
    const explicitlyNonSolid = /variant\s*=\s*["'](outlined|outlined-sub|soft|text|ghost)["']/.test(
      block,
    );
    return hasPrimary && !explicitlyNonSolid;
  });
  if (primarySolidButtons.length > 1) {
    violations.push({
      rule: "primary-cta-overuse",
      line: primarySolidButtons[1].line,
      detail: `primary solid로 보이는 Button이 ${primarySolidButtons.length}개 발견됨.`,
      suggestion:
        "primary solid는 화면의 가장 중요한 액션 1개만 사용하고, 나머지는 outlined/assistive/text 계열로 낮추세요.",
    });
  }

  const primaryTokenRefs = [
    ...source.matchAll(
      /var\(--color-(?:semantic-primary|blue|cobalt|trostEapBanner|yellow-primary)[\w-]*\)/g,
    ),
  ];
  const primaryRoleSignals = [
    {
      name: "button",
      matched:
        /<\s*Button\b[\s\S]*?(?:color\s*=\s*["']primary["']|variant\s*=\s*["']solid["'])/.test(
          source,
        ),
    },
    {
      name: "chip",
      matched: /<\s*Chip\b[\s\S]*?(?:color|background|variant\s*=\s*["']filled["'])/.test(source),
    },
    {
      name: "badge",
      matched: /<\s*Badge\b[\s\S]*?(?:color|background|variant\s*=\s*["']filled["'])/.test(source),
    },
    {
      name: "background",
      matched:
        /background(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "border",
      matched:
        /border(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "icon",
      matched:
        /<\s*\w+Icon\b[\s\S]*?color\s*=\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
  ].filter((signal) => signal.matched);

  if (primaryTokenRefs.length >= 8 || primaryRoleSignals.length >= 4) {
    violations.push({
      rule: "primary-color-role-overload",
      line: 1,
      detail: `primary 계열 색상이 여러 역할로 과다 사용됨: ${primaryRoleSignals.map((s) => s.name).join(", ") || `${primaryTokenRefs.length} token refs`}`,
      suggestion:
        "Primary color는 CTA/interactive/highlight 중 제한된 역할에만 사용하세요. 배경/태그/카드/포커스까지 모두 primary로 처리하지 말고 neutral surface와 텍스트 위계로 낮추세요. get_pattern_guide('visual-antipatterns') 참조.",
    });
  }

  if (
    /background(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100))/g.test(
      source,
    ) &&
    /<\s*(?:Chip|Badge)\b[\s\S]*?(?:variant\s*=\s*["'](?:filled|soft)["']|background(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100)))/.test(
      source,
    )
  ) {
    violations.push({
      rule: "tone-on-tone-filled",
      line: 1,
      detail: "연한 primary/blue 배경과 같은 계열 filled/soft 라벨이 함께 사용됨.",
      suggestion:
        "같은 톤 위 같은 톤 filled component는 강조 계층이 약합니다. 배경은 neutral로 낮추거나 라벨을 outlined/text 계열로 바꾸세요. get_pattern_guide('visual-antipatterns') 참조.",
    });
  }

  if (
    /(linear|radial|conic)-gradient\s*\(/.test(source) &&
    /(logo|brand|accent|hero|card|badge|chip|background)/i.test(source)
  ) {
    violations.push({
      rule: "logo-color-as-ui-accent",
      line: 1,
      detail: "gradient/accent 색상이 UI surface나 강조 요소로 사용된 정황.",
      suggestion:
        "브랜드 로고 컬러는 UI accent color가 아닙니다. 로고 표현 용도로만 두고 UI는 DS semantic token을 사용하세요. get_pattern_guide('visual-antipatterns') 참조.",
    });
  }

  const chipBlocks = getJsxBlocks(source, "Chip");
  if (chipBlocks.length > 8) {
    violations.push({
      rule: "chip-overuse",
      line: chipBlocks[8].line,
      detail: `Chip이 ${chipBlocks.length}개 발견됨.`,
      suggestion:
        "Chip은 상태/분류/짧은 속성에만 제한적으로 사용하세요. 섹션 장식이나 모든 카드 반복 강조는 피하세요. get_component_guide('Chip') 참조.",
    });
  }
  for (const { block, line } of chipBlocks) {
    if (!/\blabel\s*=/.test(block)) {
      violations.push({
        rule: "chip-missing-label",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "Chip 은 label prop 이 필수입니다. children 대신 label='...' 형태로 전달하세요. get_component_guide('Chip') 참조.",
      });
    }
    const label = block.match(/label\s*=\s*["']([^"']+)["']/)?.[1];
    if (label && (label.length > 8 || /^(안내|확인|추천|혜택|중요|필독|NEW|신규)$/i.test(label))) {
      violations.push({
        rule: "chip-decorative-use",
        line,
        detail: `Chip label='${label}'`,
        suggestion:
          "Chip은 장식성 섹션 라벨보다 상태/분류/속성 표시용으로 사용하세요. 일반 안내 강조는 텍스트 위계나 neutral notice로 처리하세요.",
      });
    }
  }

  // Card 구조 관련 블록 검사 (nested / Badge·Chip overuse per Card / Footer 버튼 과다)
  // 컨테이너 안에 self-closing JSX 가 많으니 비탐욕 정규식 대신 depth-counted balanced 블록 사용.
  const cardRootBlocks = getBalancedJsxBlocks(source, "Card\\.Root");
  for (const { block, line } of cardRootBlocks) {
    const cardOpenCount = (block.match(/<\s*Card\.Root\b/g) || []).length;
    if (cardOpenCount > 1) {
      violations.push({
        rule: "nested-card",
        line,
        detail: `Card.Root 안에 Card.Root 가 ${cardOpenCount - 1}회 중첩됨.`,
        suggestion:
          "Card 안에 Card 중첩 금지 — 시각 레이어 3단계 이상은 정보 계층을 무너뜨립니다. 내부 구획은 Section Divider 또는 배경색으로 구분하세요. get_component_guide('Card') 참조.",
      });
    }
    const chipCount = (block.match(/<\s*Chip\b/g) || []).length;
    const badgeCount = (block.match(/<\s*Badge\b/g) || []).length;
    const labelTotal = chipCount + badgeCount;
    if (labelTotal >= 3) {
      violations.push({
        rule: "card-badge-overuse",
        line,
        detail: `Card 1개에 Badge/Chip 이 ${labelTotal}개 발견됨 (Chip=${chipCount}, Badge=${badgeCount}).`,
        suggestion:
          "Card 당 Badge/Chip 최대 2개 — 가장 중요한 상태만 남기고 나머지는 Footer 메타텍스트로 처리하세요. get_component_guide('Card') 참조.",
      });
    }
  }
  const cardFooterBlocks = getBalancedJsxBlocks(source, "Card\\.Footer");
  for (const { block, line } of cardFooterBlocks) {
    const footerButtonCount = (block.match(/<\s*Button\b/g) || []).length;
    if (footerButtonCount >= 3) {
      violations.push({
        rule: "card-footer-button-overuse",
        line,
        detail: `Card.Footer 안에 Button 이 ${footerButtonCount}개 발견됨.`,
        suggestion:
          "Card Footer 는 Primary 1개 + Secondary 1개까지. 더 필요하면 Card 구조가 아니라 Modal/BottomSheet 형태가 맞는지 검토하세요. get_component_guide('Card') 참조.",
      });
    }
  }

  for (const { block, line, index } of getIconBlocks(source)) {
    const contextBefore = source.slice(Math.max(0, index - 120), index);
    const compactContextBefore = contextBefore.replace(/\s+/g, " ");
    const isDsIconSlot =
      /(leftIcon|rightIcon|icon|prefix|suffix)\s*=\s*\{\s*$/.test(contextBefore) ||
      /(leftIcon|rightIcon|icon|prefix|suffix)\s*=\s*\{\s*$/.test(compactContextBefore);
    const hasExplicitColor =
      /\bcolor\s*=/.test(block) ||
      /\bstyle\s*=\s*\{\s*\{[\s\S]*?\bcolor\s*:/.test(block) ||
      /\bclassName\s*=/.test(block);
    const parentHasTokenColor = /color\s*:\s*["']var\(--color-/.test(contextBefore);

    if (!isDsIconSlot && !hasExplicitColor && !parentHasTokenColor) {
      violations.push({
        rule: "icon-default-color",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "단독 아이콘은 기본 currentColor에 기대지 말고 주변 UI에 맞는 토큰 컬러를 명시하세요. 예: color='var(--semantic-primary-main)' 또는 부모 style color. get_pattern_guide('icon-color') 참조.",
      });
    }
  }

  const emphasisSignals = [
    { name: "gradient", matched: /(linear|radial|conic)-gradient\s*\(/.test(source) },
    { name: "chip", matched: /<\s*Chip\b/.test(source) },
    { name: "badge", matched: /<\s*Badge\b/.test(source) },
    {
      name: "semantic-background",
      matched: /background(?:Color)?\s*:\s*["']var\(--semantic-/.test(source),
    },
    { name: "icon", matched: /<\s*\w+Icon\b/.test(source) },
  ].filter((signal) => signal.matched);
  if (emphasisSignals.length >= 4) {
    violations.push({
      rule: "visual-emphasis-overload",
      line: 1,
      detail: `강조 장치가 동시에 많이 사용됨: ${emphasisSignals.map((s) => s.name).join(", ")}`,
      suggestion:
        "안내/보조 영역은 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 1~2개만 사용하세요. get_pattern_guide('notice') 참조.",
    });
  }

  return violations;
}

export function validateMockup(
  args: {
    source?: string;
    filePath?: string;
    intent?: "user-app" | "admin-cms";
  },
  context?: MockupValidationContext,
) {
  let source = args.source;
  if (!source && args.filePath) {
    if (!fs.existsSync(args.filePath)) {
      return {
        ok: false,
        error: `File not found: ${args.filePath}`,
      };
    }
    source = fs.readFileSync(args.filePath, "utf-8");
  }
  if (!source) {
    return {
      ok: false,
      error: "Provide either 'source' or 'filePath'.",
    };
  }
  const violations = validateMockupSource(source, { intent: args.intent, context });

  // 사용자가 한눈에 볼 수 있도록 요약 정보 동봉.
  const byRule: Record<string, number> = {};
  for (const v of violations) byRule[v.rule] = (byRule[v.rule] ?? 0) + 1;
  const topRules = Object.entries(byRule)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([rule, count]) => ({ rule, count }));

  const humanReadable =
    violations.length === 0
      ? "✓ 위반 없음 — DS 룰 모두 통과"
      : `✗ ${violations.length}건 위반 / 상위: ${topRules.map((r) => `${r.rule}(${r.count})`).join(", ")}`;

  return {
    ok: violations.length === 0,
    violationCount: violations.length,
    summary: { byRule, topRules, humanReadable },
    violations,
  };
}
