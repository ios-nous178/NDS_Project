import fs from "node:fs";
import path from "node:path";
import { checkInspectorInstalledForCwd } from "./inspector-installer.js";

export interface MockupValidationContext {
  tokenSet: Set<string>;
  componentNames: Set<string>;
  iconSet: Set<string>;
  /**
   * DS 컴포넌트별 prop union 허용값.
   *   propAllowedValues.get("IconButton")?.get("size") === ["x-large","large","medium","small"]
   * 카탈로그에서 추출 가능한 prop 만 채워진다.
   */
  propAllowedValues?: Map<string, Map<string, string[]>>;
}

const EMPTY_VALIDATION_CONTEXT: MockupValidationContext = {
  tokenSet: new Set(),
  componentNames: new Set(),
  iconSet: new Set(),
  propAllowedValues: new Map(),
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

/**
 * JSX 여는 태그의 끝 위치를 찾는다.
 *   <ComponentName ... > 의 첫 번째 unmatched `>` 까지를 슬라이스해서 반환.
 * 문자열 / `{...}` expression 안의 `>` 는 건너뛴다 (예: arrow fn 의 `>`).
 *
 * children 영역까지 끌어와서 검증하면 nested JSX 의 prop 값을 부모 컴포넌트의
 * 허용값 표와 잘못 매칭할 수 있기 때문에, 여는 태그만 정확히 잘라낸다.
 */
function extractOpenTag(block: string, startOfName: number): string {
  let depth = 0;
  let quote: '"' | "'" | null = null;
  for (let i = startOfName; i < block.length; i++) {
    const ch = block[i];
    if (quote) {
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth === 0) return block.slice(0, i + 1);
  }
  return block;
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
        suggestion:
          "토큰 CSS 변수(--color-*)로 교체. find_token({ query: '<text or #hex>' }) 사용.",
      });
    }
    // 2. 인라인 px/rem (transform 류 제외, var(...) 안의 fallback 제외)
    {
      const stripped = line.replace(/var\([^)]*\)/g, "");
      const isMotion = /transform|translate|scale|rotate|matrix/.test(stripped);
      if (!isMotion) {
        const pxMatches = [...stripped.matchAll(/\b(\d+(?:\.\d+)?)(px|rem)\b/g)];
        if (pxMatches.length > 0) {
          violations.push({
            rule: "inline-spacing",
            line: ln,
            detail: line.trim(),
            suggestion: "spacing 토큰으로 교체. find_token({ group: 'spacing' }) 사용.",
          });
        }
        // 2-bis. 4pt grid 위반 (5/7/9/11/13/14/15/18/22/26/30 등) — px 한정
        for (const m of pxMatches) {
          const value = parseFloat(m[1]);
          if (m[2] !== "px" || value <= 0) continue;
          if (value % 4 !== 0) {
            violations.push({
              rule: "non-4pt-spacing",
              line: ln,
              detail: `${value}px (4 의 배수 아님)`,
              suggestion:
                "4pt grid 위반. 4 의 배수(4/8/12/16/20/24…) 로 보정하거나 var(--gap-*|--inset-*) semantic 토큰 사용.",
            });
          }
        }
      }
    }
    // 2-2. padding/margin/gap 에 primitive --spacing-* 직접 사용 금지 — semantic 만 허용
    if (
      /\b(padding(?:-?(?:top|right|bottom|left))?|margin(?:-?(?:top|right|bottom|left))?|gap|columnGap|column-gap|rowGap|row-gap)\s*:\s*["']?\s*var\(--spacing-[\w-]+/i.test(
        line,
      )
    ) {
      violations.push({
        rule: "non-semantic-spacing",
        line: ln,
        detail: line.trim(),
        suggestion:
          "padding/margin/gap 은 primitive var(--spacing-*) 가 아니라 semantic var(--gap-*|--inset-*) 만 사용하세요. find_token({ group: 'gap' }) / find_token({ group: 'inset' }) 참조.",
      });
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
          "먼저 find_icon으로 @nudge-design/icons에 적합한 아이콘이 있는지 확인하세요. 없을 때만 인라인 SVG로 새로 그리는 것이 허용됩니다 (텍스트/이모지는 금지).",
      });
    }
    // 4-bis. 이모지 / 텍스트 기호 절대 금지
    // 사용자 정책: AI 가 생성한 화면에 이모지·기호 텍스트가 절대로 들어가면 안 됨.
    // 어떤 위치에 있어도 (라벨 / 버튼 안 / 헤더 / placeholder / 주석 외 문자열) 위반.
    {
      // 4-bis-1. 이모지 (Unicode emoji ranges + variation selector)
      const emojiPattern =
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]️?/u;
      // 라인 코멘트(//) 안의 이모지는 봐주지만, JSX/문자열 내부는 무조건 잡는다.
      const codeOnly = line.replace(/\/\/.*$/, "");
      if (emojiPattern.test(codeOnly)) {
        violations.push({
          rule: "emoji-banned",
          line: ln,
          detail: line.trim(),
          suggestion:
            "이모지는 사용 금지입니다. 아이콘이 필요하면 find_icon 으로 @nudge-design/icons 에서 찾고, 라벨이면 평문으로 작성하세요.",
        });
      }
      // 4-bis-2. 텍스트 기호 — 아이콘 대용 / 장식 / rating 표현 전부 금지.
      // × ＋ －처럼 수학 연산자로 흔히 쓰이는 문자는 제외해 false-positive 회피.
      const STRICT_SYMBOL = /[→←↑↓↔↕➜➔⮕›‹»«▶◀▲▼◆◇✓✗✘✕☑☒★☆⭐♥♡❤•]/;
      if (STRICT_SYMBOL.test(codeOnly)) {
        violations.push({
          rule: "text-symbol-banned",
          line: ln,
          detail: line.trim(),
          suggestion:
            "→ ← ✓ ★ • 같은 기호 텍스트 사용 금지. 아이콘이 필요하면 find_icon, 진행/카운트 표시면 DS 컴포넌트(StatusTimeline/StepIndicator/Rating 등)를 사용하세요.",
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
          "그라데이션 금지. 단색 토큰(var(--color-*))만 사용. get_guide({ topic: 'principles' }) 참조.",
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
            "Button color='assistive' + solid는 cool-gray 배경이라 비활성처럼 보임. 활성 CTA면 'primary' 또는 'secondary' 사용. get_guide({ topic: 'component:Button' }) 참조.",
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
          "Card.Header/Body/Footer는 자체 padding을 가짐. 외곽 padding을 또 주면 이중 패딩으로 어긋남. get_guide({ topic: 'component:Card' }) 참조.",
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
          suggestion: "find_token({ query: ... }) 으로 올바른 토큰 검색.",
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
    /import\s*\{([^}]+)\}\s*from\s*["']@nudge-design\/(react|icons)["']/g,
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
              ? `find_component({ query: '${name}' }) 으로 유사 컴포넌트 확인.`
              : `find_icon({ query: '${name.replace(/Icon$/, "")}' }) 으로 유사 아이콘 확인.`,
        });
      }
    }
  }

  // 6.5. invalid-prop-value — string-literal union prop 의 잘못된 값 검출.
  // 예: <IconButton size="md"> (유효: x-large/large/medium/small),
  //     <Card variant="content"> (유효: outlined/elevated/flat)
  // validate_mockup 은 패턴 검사이므로 tsc 가 잡는 타입 오류를 자체 룰로 흉내낸다.
  if (context.propAllowedValues && context.propAllowedValues.size > 0) {
    for (const [compName, propMap] of context.propAllowedValues) {
      // `<CompName ` 또는 `<CompName/` 또는 `<CompName>` 만 매칭 — `<CompName.Sub` namespace 제외
      const openRe = new RegExp(`<\\s*${compName}(?=[\\s/>])`, "g");
      let m: RegExpExecArray | null;
      while ((m = openRe.exec(source)) !== null) {
        const openTag = extractOpenTag(source.slice(m.index), `<${compName}`.length);
        const attrRe = /\b(\w+)\s*=\s*"([^"]*)"/g;
        let am: RegExpExecArray | null;
        while ((am = attrRe.exec(openTag)) !== null) {
          const propName = am[1];
          const propValue = am[2];
          const allowed = propMap.get(propName);
          if (!allowed) continue;
          if (allowed.includes(propValue)) continue;
          violations.push({
            rule: "invalid-prop-value",
            line: lineNumberAt(source, m.index + am.index),
            detail: `<${compName} ${propName}="${propValue}"> — 허용값 아님.`,
            suggestion: `${compName}.${propName} 허용값: ${allowed.map((v) => `"${v}"`).join(", ")}. find_component({ name: '${compName}' }) 로 prop 명세 확인.`,
          });
        }
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
        "우측 화살표는 대표 전진 CTA 1개에만 남기고 반복/보조 CTA에서는 제거. get_guide({ topic: 'pattern:cta-group' }) 참조.",
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
        "Primary color는 CTA/interactive/highlight 중 제한된 역할에만 사용하세요. 배경/태그/카드/포커스까지 모두 primary로 처리하지 말고 neutral surface와 텍스트 위계로 낮추세요. get_guide({ topic: 'pattern:visual-antipatterns' }) 참조.",
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
        "같은 톤 위 같은 톤 filled component는 강조 계층이 약합니다. 배경은 neutral로 낮추거나 라벨을 outlined/text 계열로 바꾸세요. get_guide({ topic: 'pattern:visual-antipatterns' }) 참조.",
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
        "브랜드 로고 컬러는 UI accent color가 아닙니다. 로고 표현 용도로만 두고 UI는 DS semantic token을 사용하세요. get_guide({ topic: 'pattern:visual-antipatterns' }) 참조.",
    });
  }

  const chipBlocks = getJsxBlocks(source, "Chip");
  if (chipBlocks.length > 8) {
    violations.push({
      rule: "chip-overuse",
      line: chipBlocks[8].line,
      detail: `Chip이 ${chipBlocks.length}개 발견됨.`,
      suggestion:
        "Chip은 상태/분류/짧은 속성에만 제한적으로 사용하세요. 섹션 장식이나 모든 카드 반복 강조는 피하세요. get_guide({ topic: 'component:Chip' }) 참조.",
    });
  }
  for (const { block, line } of chipBlocks) {
    if (!/\blabel\s*=/.test(block)) {
      violations.push({
        rule: "chip-missing-label",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "Chip 은 label prop 이 필수입니다. children 대신 label='...' 형태로 전달하세요. get_guide({ topic: 'component:Chip' }) 참조.",
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
          "Card 안에 Card 중첩 금지 — 시각 레이어 3단계 이상은 정보 계층을 무너뜨립니다. 내부 구획은 Section Divider 또는 배경색으로 구분하세요. get_guide({ topic: 'component:Card' }) 참조.",
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
          "Card 당 Badge/Chip 최대 2개 — 가장 중요한 상태만 남기고 나머지는 Footer 메타텍스트로 처리하세요. get_guide({ topic: 'component:Card' }) 참조.",
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
          "Card Footer 는 Primary 1개 + Secondary 1개까지. 더 필요하면 Card 구조가 아니라 Modal/BottomSheet 형태가 맞는지 검토하세요. get_guide({ topic: 'component:Card' }) 참조.",
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
          "단독 아이콘은 기본 currentColor에 기대지 말고 주변 UI에 맞는 토큰 컬러를 명시하세요. 예: color='var(--semantic-primary-main)' 또는 부모 style color. get_guide({ topic: 'pattern:icon-color' }) 참조.",
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
        "안내/보조 영역은 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 1-2개만 사용하세요. get_guide({ topic: 'pattern:notice' }) 참조.",
    });
  }

  // ─── Card Everything Syndrome ────────────────────────────
  // 한 mockup 에 Card.Root 5개 초과 → 모든 영역을 카드로 감싸는 패턴
  const cardRootTotal = (source.match(/<\s*Card\.Root\b/g) || []).length;
  if (cardRootTotal >= 5) {
    violations.push({
      rule: "card-everything",
      line: 1,
      detail: `한 mockup 에 Card.Root 가 ${cardRootTotal}개 — 모든 정보 단위를 카드로 감싸는 패턴.`,
      suggestion:
        "Card 는 '독립된 정보 단위' 에만. 단순 group/section 은 spacing(--gap-loose) + heading + Divider 로 위계를 표현하세요. bannedPatterns: card-everything 참조.",
    });
  }

  // ─── Decorative Shadow ──────────────────────────────────
  // 자체 box-shadow 를 가진 요소가 4개 이상 → shadow-heavy / decorative shadow
  const inlineShadowMatches = source.match(/box-shadow\s*:\s*[^;}\n]+/g) || [];
  // floating UI 컴포넌트(Modal/Popup/Dropdown/BottomSheet/Drawer/Toast)는 정당
  // → 인라인 box-shadow 만 카운트 (DS 컴포넌트 사용은 OK)
  const decorativeShadowCount = inlineShadowMatches.filter(
    (s) => !/var\(--shadow-/.test(s) && !/0\s+0\s+0\s+\d+px/.test(s), // focus ring 제외
  ).length;
  if (decorativeShadowCount >= 4) {
    violations.push({
      rule: "decorative-shadow",
      line: 1,
      detail: `인라인 box-shadow 가 ${decorativeShadowCount}곳 — shadow-heavy layout.`,
      suggestion:
        "Shadow 는 floating UI(Modal/Popup/Dropdown/BottomSheet)에만. 일반 카드/리스트는 border 또는 surface tone 으로 구분. bannedPatterns: decorative-shadow 참조.",
    });
  }

  // ─── 헤딩 반복 (h1/h2 다중) ──────────────────────────────
  const h1Count = (source.match(/<\s*h1\b/g) || []).length;
  const h2Count = (source.match(/<\s*h2\b/g) || []).length;
  if (h1Count >= 2) {
    violations.push({
      rule: "repeated-h1",
      line: 1,
      detail: `<h1> 이 ${h1Count}개 — 페이지 최상위 헤딩은 1개여야 합니다.`,
      suggestion:
        "한 mockup 에 h1 은 1개. 보조 섹션은 h3 이하 사용. bannedPatterns: repeated-h1 참조.",
    });
  }
  if (h2Count >= 4) {
    violations.push({
      rule: "repeated-h2",
      line: 1,
      detail: `<h2> 가 ${h2Count}개 — 같은 화면에 큰 제목이 너무 많습니다.`,
      suggestion:
        "h2 는 화면당 2-3개 이내. 더 세분화가 필요하면 h3/h4 로 위계 표현. bannedPatterns: repeated-h1 참조.",
    });
  }

  // ─── Bold 남발 ───────────────────────────────────────────
  const boldMatches =
    (source.match(/font-?weight\s*:\s*(?:bold|700|800|900)\b/gi) || []).length +
    (source.match(/\bfontWeight\s*:\s*(?:["']?bold["']?|700|800|900)\b/gi) || []).length;
  if (boldMatches >= 5) {
    violations.push({
      rule: "bold-overuse",
      line: 1,
      detail: `Bold(700+) 텍스트 선언이 ${boldMatches}곳 — Bold 남발.`,
      suggestion:
        "Bold 는 화면당 1-2개 핵심 텍스트에만. 본문은 Regular(400)/Medium(500), 보조 제목은 Semibold(600). bannedPatterns: bold-overuse 참조.",
    });
  }

  // ─── Brand BG 한 화면 1곳 ─────────────────────────────
  // --semantic-bg-brand-default / --semantic-bg-brand-subtle 가 2회 이상이면 위반.
  const brandBgMatches = source.match(/var\(--semantic-bg-brand-(?:default|subtle)\)/g) || [];
  if (brandBgMatches.length >= 2) {
    violations.push({
      rule: "brand-bg-overuse",
      line: 1,
      detail: `Brand background 토큰이 ${brandBgMatches.length}회 사용됨 (한 화면에 최대 1곳).`,
      suggestion:
        "Brand BG 는 의미 있는 notice / 핵심 강조 1곳에만. 나머지는 var(--semantic-bg-surface*) 또는 elevated 사용. get_guide({ topic: 'pattern:visual-antipatterns' }) 참조.",
    });
  }

  // ─── 헤딩 안 장식 아이콘 금지 ─────────────────────────
  // <h3>/<h4> balanced block 안에 *Icon / <svg / 이모지가 있으면 위반.
  for (const tag of ["h3", "h4"] as const) {
    for (const { block, line } of getBalancedJsxBlocks(source, tag)) {
      if (/<\s*\w+Icon\b/.test(block) || /<\s*svg\b/.test(block)) {
        violations.push({
          rule: "heading-decorative-icon",
          line,
          detail: block.split("\n")[0].trim(),
          suggestion: `<${tag}> 안에 SVG / *Icon 사용 금지 — 헤딩은 텍스트만. 강조가 필요하면 별도 라인 또는 Section header 컴포넌트 사용.`,
        });
      }
    }
  }

  // ─── 영역별 Primary CTA 단일성 ────────────────────────
  // Card.Root / <section> / Modal / BottomSheet 각 컨테이너 안 primary solid Button > 1 이면 위반.
  const ctaContainers = [
    { pattern: "Card\\.Root", label: "Card" },
    { pattern: "section", label: "<section>" },
    { pattern: "Modal", label: "Modal" },
    { pattern: "BottomSheet", label: "BottomSheet" },
  ];
  for (const { pattern, label } of ctaContainers) {
    for (const { block, line } of getBalancedJsxBlocks(source, pattern)) {
      const buttonBlocksIn = getJsxBlocks(block, "Button");
      const primarySolidInside = buttonBlocksIn.filter(({ block: b }) => {
        const hasPrimary = /color\s*=\s*["']primary["']/.test(b) || !/color\s*=/.test(b);
        const nonSolid = /variant\s*=\s*["'](outlined|outlined-sub|soft|text|ghost)["']/.test(b);
        return hasPrimary && !nonSolid;
      });
      if (primarySolidInside.length > 1) {
        violations.push({
          rule: "primary-cta-per-container",
          line,
          detail: `${label} 1개 안에 primary solid Button 이 ${primarySolidInside.length}개.`,
          suggestion: `한 영역(${label}) 안 Primary Button 은 최대 1개. 보조 액션은 variant="outlined" / color="assistive" / variant="text" 로 낮추세요. get_guide({ topic: 'pattern:cta-group' }) 참조.`,
        });
      }
    }
  }

  // ─── 아이콘 스타일 혼용 ──────────────────────────────────
  // @nudge-design/icons 가 아닌 외부 라이브러리 아이콘 import 검출
  const externalIconLibs = [
    { name: "lucide-react", re: /from\s+["']lucide-react["']/ },
    { name: "react-icons", re: /from\s+["']react-icons\// },
    { name: "@heroicons", re: /from\s+["']@heroicons\// },
    { name: "@radix-ui icons", re: /from\s+["']@radix-ui\/react-icons["']/ },
    { name: "@ant-design/icons", re: /from\s+["']@ant-design\/icons["']/ },
  ].filter((lib) => lib.re.test(source));
  if (externalIconLibs.length > 0) {
    violations.push({
      rule: "mixed-icon-style",
      line: 1,
      detail: `외부 아이콘 라이브러리 사용: ${externalIconLibs.map((l) => l.name).join(", ")}`,
      suggestion:
        "DS 는 `@nudge-design/icons` 단일 셋만. 필요 아이콘이 없으면 find_icon 으로 확인 후 그래도 없으면 인라인 SVG. bannedPatterns: mixed-icon-style 참조.",
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

  const checklist = buildSelfCheckChecklist(byRule);
  const checklistReport = renderChecklistReport(checklist);

  const humanReadable =
    violations.length === 0
      ? "[OK] 위반 없음 — DS 룰 모두 통과"
      : `[FAIL] ${violations.length}건 위반 / 상위: ${topRules.map((r) => `${r.rule}(${r.count})`).join(", ")}`;

  const _nextSuggestion =
    violations.length === 0
      ? "Self-Check 1차 통과. **반드시 한 번 더 validate_mockup 을 호출해 2차 확인** (총 2회 self-check 가 워크스페이스 룰). " +
        "2차도 통과면: (1) dev_server({ action: 'start' }) → check_preview 로 런타임 에러 0건 확인. " +
        "(2) report_mockup_usage 호출. " +
        "(3) **반드시 build_singlefile_html({}) 호출** — 이 워크스페이스의 표준 산출물 형식은 단일 HTML 파일입니다. 사용자에게 '만들까요' 라고 묻지 말고 그냥 실행하세요 (명시적 거부 시에만 생략). 손으로 .html 작성·vite build 직접 실행·다른 번들러 사용 금지 — nds-* / onClick 손실됨. " +
        "(4) dev_server({ action: 'stop' })."
      : "위반을 수정한 뒤 validate_mockup 재실행. **위반 0건이 될 때까지 반복 (최소 2회 self-check)** — 1회차 위반 수정 후 2회차 확인까지 통과해야 산출 가능. 위반을 인지하고 그대로 제출하는 것은 금지됩니다.";

  return {
    ok: violations.length === 0,
    violationCount: violations.length,
    summary: { byRule, topRules, humanReadable, checklist, checklistReport },
    violations,
    workspaceNotice: buildInspectorWorkspaceNotice(args),
    _nextSuggestion,
  };
}

// ─── Self-Check 체크리스트 (사용자가 정의한 5개 분류) ───
// 룰 ID 다수 → 분류 1개로 매핑한다. byRule 카운트만 받아서 violations / pass 도출.
interface ChecklistItem {
  id: string;
  label: string;
  pass: boolean;
  violations: number;
  ruleIds: string[];
}
const CHECKLIST_SPEC: Array<{ id: string; label: string; ruleIds: string[] }> = [
  {
    id: "semantic-spacing",
    label: "Spacing 토큰 사용 (raw px 없음, --spacing-* 직접 사용 없음)",
    ruleIds: ["inline-spacing", "non-semantic-spacing"],
  },
  {
    id: "4pt-grid",
    label: "4pt Grid 준수",
    ruleIds: ["non-4pt-spacing"],
  },
  {
    id: "brand-bg-single",
    label: "Brand BG 1개 이하",
    ruleIds: ["brand-bg-overuse"],
  },
  {
    id: "heading-no-icon",
    label: "헤딩 장식 아이콘 없음",
    ruleIds: ["heading-decorative-icon"],
  },
  {
    id: "primary-cta-single",
    label: "Primary Button 단일성 (영역별)",
    ruleIds: ["primary-cta-per-container", "primary-cta-overuse"],
  },
];

function buildSelfCheckChecklist(byRule: Record<string, number>): ChecklistItem[] {
  return CHECKLIST_SPEC.map(({ id, label, ruleIds }) => {
    const violations = ruleIds.reduce((sum, rid) => sum + (byRule[rid] ?? 0), 0);
    return { id, label, ruleIds, violations, pass: violations === 0 };
  });
}

function renderChecklistReport(items: ChecklistItem[]): string {
  const lines = items.map((i) => `- ${i.label}: ${i.pass ? "통과" : `위반 ${i.violations}건`}`);
  return ["[Self-Check 결과]", ...lines].join("\n");
}

function buildInspectorWorkspaceNotice(args: { filePath?: string }): string | undefined {
  const cwd = guessWorkspaceCwd(args.filePath);
  const { installed, filePath } = checkInspectorInstalledForCwd(cwd);
  if (installed) return undefined;
  if (!filePath) {
    // 위치를 못 찾으면 사용자 환경 가정이 어렵다 — 굳이 경고하지 않음.
    return undefined;
  }
  return (
    "DsInspector 미셋업 (런타임 DS 비율 시각화 없음). " +
    "한 번 자동 패치: get_setup({ step: 'inspector' }). " +
    "violationCount 와는 무관 — 셋업 안 해도 검증은 통과합니다."
  );
}

function guessWorkspaceCwd(filePath?: string): string {
  if (filePath && path.isAbsolute(filePath)) {
    // filePath 가 있으면 거기서 위로 올라가며 package.json 을 찾아 워크스페이스 추정.
    let dir = path.dirname(filePath);
    for (let i = 0; i < 8; i += 1) {
      if (fs.existsSync(path.join(dir, "package.json"))) return dir;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return process.cwd();
}
