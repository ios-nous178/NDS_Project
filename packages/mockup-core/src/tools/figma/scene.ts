/**
 * tools/figma/scene.ts — 목업 → Figma "평면 레이어" scene 추출 (canary).
 *
 * Figma REST API 로는 캔버스에 디자인 노드를 만들 수 없다(읽기/댓글/변수만). 그래서
 * 파이프라인은 2단이다:
 *   1) 데스크탑 앱이 self-contained dist/index.html 을 숨은 BrowserWindow 에 렌더하고
 *      `buildFigmaSceneScript()` 를 주입해 DOM 을 평면 scene 으로 추출 → scene.json.
 *   2) 짝이 되는 Figma 플러그인(tools/figma-plugin)이 scene.json 을 읽어 frame/rect/text/
 *      image 로 캔버스에 짓는다.
 *
 * 이 모듈은 (a) 브라우저에 주입할 워커 소스 문자열과 (b) 추출 결과를 검증/정규화하는
 * 순수 함수만 담는다. DOM 접근이 없으므로 normalize 는 node:test 로 단위 테스트 가능.
 *
 * DS-aware: 외부 HTML→Figma 도구가 못 하는 것 — `<nds-*>` 커스텀 엘리먼트를 만나면
 * 레이어 이름을 DS 컴포넌트명(`ndsTagToComponentName` 규칙 미러)으로 박는다. Figma DS
 * 라이브러리가 publish 되면 이 dsComponent/props 메타로 평면 레이어 → 진짜 컴포넌트
 * 인스턴스 승격이 가능(Phase 3).
 */

export type FigmaSceneNodeType = "frame" | "text" | "image";

export interface FigmaStroke {
  color: string; // CSS rg(a) 문자열
  weight: number;
}

export interface FigmaFont {
  family: string;
  size: number;
  weight: number;
  color: string; // CSS rg(a)
  lineHeight: number | null;
  align: string; // left|center|right|justify
}

export interface FigmaSceneNode {
  type: FigmaSceneNodeType;
  name: string;
  /** root(=body) content box 기준 절대 좌표(px). 플러그인은 root 프레임 안에 절대 배치한다. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** frame: 배경 채움 CSS rgba (없으면 생략). */
  fill?: string | null;
  stroke?: FigmaStroke | null;
  radius?: number;
  opacity?: number;
  /** text 노드 본문. */
  text?: string;
  font?: FigmaFont;
  /** image 노드: data: URL (base64 인라인). 외부 URL 은 버린다(무유출 단일 산출물 기조). */
  image?: string;
  /** 가장 가까운 nds-* 조상에서 유도한 DS 컴포넌트명(레이어 명명 + Phase 3 승격용). */
  dsComponent?: string | null;
  props?: Record<string, string>;
}

export interface FigmaScene {
  version: number;
  /** 추출 시각 viewport 기준 전체 캔버스 크기. */
  width: number;
  height: number;
  nodes: FigmaSceneNode[];
}

/** 한 scene 당 노드 상한 — 폭주(거대한 표 등) 시 plugin/Figma 보호. 초과분은 잘라낸다. */
export const MAX_SCENE_NODES = 4000;

/**
 * 브라우저(렌더된 dist) 컨텍스트에서 실행할 추출 스크립트 소스.
 *
 * Electron `webContents.executeJavaScript` 가 이 IIFE 의 반환값(직렬화 가능한 scene)을
 * 그대로 돌려준다. 외부 의존 없는 self-contained 바닐라 JS 여야 한다.
 *
 * 추출 규칙(평면 레이어, 노이즈 최소화):
 *  - 보이는 요소만(display/visibility/opacity/0-size 제외, data-nds-stamp 바 제외).
 *  - 시각적으로 의미 있을 때만 frame 노드 방출(배경 채움 · 보더 · radius 중 하나라도).
 *  - <img> 및 data: 배경이미지 → image 노드.
 *  - 직접 텍스트 런이 있으면 text 노드(폰트/색/정렬 포함).
 *  - 구조용 빈 div 는 노드를 안 만들고 자식만 계속 순회.
 */
export function buildFigmaSceneScript(): string {
  return `(function () {
  var rootEl = document.body;
  var rootRect = rootEl.getBoundingClientRect();
  var W = Math.max(rootEl.scrollWidth, Math.ceil(rootRect.width)) || Math.ceil(rootRect.width);
  var H = Math.max(rootEl.scrollHeight, Math.ceil(rootRect.height)) || Math.ceil(rootRect.height);
  var nodes = [];
  var CAP = ${MAX_SCENE_NODES};

  function px(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function visibleFill(bg) {
    return bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
  }
  function hasBorder(cs) {
    var w = px(cs.borderTopWidth) + px(cs.borderRightWidth) + px(cs.borderBottomWidth) + px(cs.borderLeftWidth);
    return w > 0 && cs.borderTopStyle !== "none";
  }
  // kebab nds-tag → PascalCase (ndsTagToComponentName 규칙 미러, 브라우저 인라인).
  function dsNameFor(el) {
    var node = el;
    while (node && node.tagName) {
      var tag = node.tagName.toLowerCase();
      if (tag.indexOf("nds-") === 0) {
        var parts = tag.slice(4).split("-").map(function (p) { return p ? p.charAt(0).toUpperCase() + p.slice(1) : ""; });
        return parts.join("");
      }
      node = node.parentElement;
    }
    return null;
  }
  function dataProps(el) {
    var out = {};
    var attrs = el.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      var a = attrs[i];
      if (a.name.indexOf("data-") === 0 && a.name !== "data-slot" && a.value) out[a.name.slice(5)] = a.value;
    }
    return out;
  }
  function directText(el) {
    var t = "";
    for (var i = 0; i < el.childNodes.length; i++) {
      var c = el.childNodes[i];
      if (c.nodeType === 3) t += c.nodeValue;
    }
    return t.replace(/\\s+/g, " ").trim();
  }
  function box(el) {
    var r = el.getBoundingClientRect();
    return {
      x: Math.round(r.left - rootRect.left),
      y: Math.round(r.top - rootRect.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  }
  function dataUrlFromBg(bg) {
    var m = /url\\((['"]?)(data:[^'")]+)\\1\\)/.exec(bg);
    return m ? m[2] : null;
  }

  function walk(el) {
    if (nodes.length >= CAP || el.nodeType !== 1) return;
    var tag = el.tagName.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "noscript" || tag === "template") return;
    if (el.getAttribute && el.getAttribute("data-nds-stamp") !== null) return; // DS 스탬프 바 제외
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return;
    var b = box(el);
    if (b.w >= 1 && b.h >= 1) {
      var ds = dsNameFor(el);
      var radius = px(cs.borderTopLeftRadius);
      if (tag === "img" && el.currentSrc && el.currentSrc.indexOf("data:") === 0) {
        nodes.push({ type: "image", name: ds || "image", x: b.x, y: b.y, w: b.w, h: b.h, image: el.currentSrc, radius: radius, dsComponent: ds });
      } else {
        var bgImg = cs.backgroundImage && cs.backgroundImage !== "none" ? dataUrlFromBg(cs.backgroundImage) : null;
        if (bgImg) {
          nodes.push({ type: "image", name: ds || tag, x: b.x, y: b.y, w: b.w, h: b.h, image: bgImg, radius: radius, dsComponent: ds });
        } else {
          var fill = visibleFill(cs.backgroundColor) ? cs.backgroundColor : null;
          var stroke = hasBorder(cs) ? { color: cs.borderTopColor, weight: px(cs.borderTopWidth) } : null;
          if (fill || stroke || radius > 0) {
            var op = parseFloat(cs.opacity);
            var n = { type: "frame", name: ds || tag, x: b.x, y: b.y, w: b.w, h: b.h, fill: fill, stroke: stroke, radius: radius, dsComponent: ds };
            if (op < 1) n.opacity = op;
            if (ds) { var p = dataProps(el); if (Object.keys(p).length) n.props = p; }
            nodes.push(n);
          }
        }
      }
      var txt = directText(el);
      if (txt && nodes.length < CAP) {
        var lh = cs.lineHeight === "normal" ? null : px(cs.lineHeight);
        nodes.push({
          type: "text",
          name: txt.length > 24 ? txt.slice(0, 24) + "…" : txt,
          x: b.x, y: b.y, w: b.w, h: b.h,
          text: txt,
          font: {
            family: (cs.fontFamily.split(",")[0] || "").replace(/['"]/g, "").trim(),
            size: px(cs.fontSize),
            weight: parseInt(cs.fontWeight, 10) || 400,
            color: cs.color,
            lineHeight: lh,
            align: cs.textAlign,
          },
          dsComponent: ds,
        });
      }
    }
    var kids = el.children;
    for (var i = 0; i < kids.length; i++) walk(kids[i]);
  }

  walk(rootEl);
  return { version: 1, width: W, height: H, nodes: nodes };
})();`;
}

interface RawNode {
  type?: unknown;
  name?: unknown;
  x?: unknown;
  y?: unknown;
  w?: unknown;
  h?: unknown;
  fill?: unknown;
  stroke?: unknown;
  radius?: unknown;
  opacity?: unknown;
  text?: unknown;
  font?: unknown;
  image?: unknown;
  dsComponent?: unknown;
  props?: unknown;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && isFinite(v) ? v : fallback;
}

function cleanNode(raw: RawNode): FigmaSceneNode | null {
  const type = raw.type;
  if (type !== "frame" && type !== "text" && type !== "image") return null;
  const w = num(raw.w);
  const h = num(raw.h);
  if (w < 1 || h < 1) return null;

  const node: FigmaSceneNode = {
    type,
    name: typeof raw.name === "string" && raw.name ? raw.name : type,
    x: Math.round(num(raw.x)),
    y: Math.round(num(raw.y)),
    w: Math.round(w),
    h: Math.round(h),
  };
  if (typeof raw.dsComponent === "string") node.dsComponent = raw.dsComponent;
  if (typeof raw.radius === "number" && raw.radius > 0) node.radius = Math.round(num(raw.radius));
  if (typeof raw.opacity === "number" && raw.opacity < 1) node.opacity = raw.opacity;

  if (type === "frame") {
    if (typeof raw.fill === "string") node.fill = raw.fill;
    const s = raw.stroke as { color?: unknown; weight?: unknown } | null | undefined;
    if (s && typeof s.color === "string")
      node.stroke = { color: s.color, weight: num(s.weight, 1) };
    if (raw.props && typeof raw.props === "object")
      node.props = raw.props as Record<string, string>;
  } else if (type === "image") {
    // data: URL 만 통과(외부 URL 은 무유출 기조상 버린다 → 빈 박스 회귀).
    if (typeof raw.image === "string" && raw.image.startsWith("data:")) node.image = raw.image;
    else return null;
  } else {
    // text
    const text = typeof raw.text === "string" ? raw.text : "";
    if (!text) return null;
    node.text = text;
    const f = raw.font as Partial<FigmaFont> | undefined;
    node.font = {
      family: typeof f?.family === "string" && f.family ? f.family : "Inter",
      size: num(f?.size, 14),
      weight: num(f?.weight, 400),
      color: typeof f?.color === "string" ? f.color : "rgb(0, 0, 0)",
      lineHeight: typeof f?.lineHeight === "number" ? f.lineHeight : null,
      align: typeof f?.align === "string" ? f.align : "left",
    };
  }
  return node;
}

/**
 * 브라우저 워커가 돌려준 raw scene 을 검증·정규화한다(신뢰 경계). 모양이 깨졌거나
 * 직렬화 불가/빈 노드는 떨궈서 플러그인이 안전하게 소비하도록 만든다.
 */
export function normalizeScene(raw: unknown): FigmaScene {
  const r = (raw ?? {}) as {
    version?: unknown;
    width?: unknown;
    height?: unknown;
    nodes?: unknown;
  };
  const rawNodes = Array.isArray(r.nodes) ? (r.nodes as RawNode[]) : [];
  const nodes: FigmaSceneNode[] = [];
  for (const rn of rawNodes) {
    if (nodes.length >= MAX_SCENE_NODES) break;
    const cleaned = cleanNode(rn ?? {});
    if (cleaned) nodes.push(cleaned);
  }
  return {
    version: num(r.version, 1),
    width: Math.max(1, Math.round(num(r.width, 1))),
    height: Math.max(1, Math.round(num(r.height, 1))),
    nodes,
  };
}
