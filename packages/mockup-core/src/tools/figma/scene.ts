/**
 * tools/figma/scene.ts — 목업 → Figma "계층 + 오토레이아웃" scene 추출 (canary).
 *
 * Figma REST API 로는 캔버스에 디자인 노드를 만들 수 없다(읽기/댓글/변수만). 그래서
 * 파이프라인은 2단이다:
 *   1) 데스크탑 앱이 self-contained dist/index.html 을 숨은 BrowserWindow 에 렌더하고
 *      `buildFigmaSceneScript()` 를 주입해 DOM 을 "트리" scene 으로 추출 → scene.json.
 *   2) 짝이 되는 Figma 플러그인(tools/figma-plugin)이 scene.json 을 읽어 frame/text/
 *      image/svg 로 캔버스에 짓는다.
 *
 * 계층/레이아웃: 평면(flat)이 아니라 트리다. flex 컨테이너는 `layout` 을 달고 자식을
 * 품으며(플러그인이 Figma Auto Layout 으로 복원), 비-flex/시각요소 없는 래퍼는 평탄화한다.
 * 좌표는 모든 노드가 root(=body) content box 기준 절대좌표를 유지하고, Auto Layout 이
 * 아닌 프레임의 자식만 플러그인이 부모 상대좌표로 환산해 절대 배치한다.
 *
 * 이 모듈은 (a) 브라우저에 주입할 워커 소스 문자열과 (b) 추출 결과를 검증/정규화하는
 * 순수 함수만 담는다. DOM 접근이 없으므로 normalize 는 node:test 로 단위 테스트 가능.
 *
 * DS-aware: 외부 HTML→Figma 도구가 못 하는 것 — `<nds-*>` 커스텀 엘리먼트를 만나면
 * 레이어 이름을 DS 컴포넌트명(`ndsTagToComponentName` 규칙 미러)으로 박는다. Figma DS
 * 라이브러리가 publish 되면 이 dsComponent/props 메타로 레이어 → 진짜 컴포넌트
 * 인스턴스 승격이 가능(Phase 3).
 */

export type FigmaSceneNodeType = "frame" | "text" | "image" | "svg";

/** flex 컨테이너 → Figma Auto Layout 매핑(없으면 frame 은 절대배치). */
export interface FigmaLayout {
  /** flex-direction row/column → 가로/세로. */
  mode: "HORIZONTAL" | "VERTICAL";
  /** gap(주축 간격) px. */
  gap: number;
  padTop: number;
  padRight: number;
  padBottom: number;
  padLeft: number;
  /** justify-content → primaryAxisAlignItems. */
  primary: "MIN" | "CENTER" | "MAX" | "SPACE_BETWEEN";
  /** align-items → counterAxisAlignItems. */
  counter: "MIN" | "CENTER" | "MAX" | "BASELINE";
  /** flex-wrap. */
  wrap: boolean;
}

export interface FigmaStroke {
  color: string; // CSS rg(a) 문자열
  weight: number; // 대표(최대) 두께 — uniform 이거나 per-side 미지원 폴백용
  /** 변별 두께(px). 한 변만 있는 구분선(border-bottom 등)이 Figma 에서 전체 박스 보더로
   * 잡히지 않게 플러그인이 개별 변 두께로 칠한다. 4변이 같으면 uniform=true. */
  top: number;
  right: number;
  bottom: number;
  left: number;
  uniform: boolean;
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
  /**
   * svg 노드: <svg> 의 outerHTML 마크업 통째. 플러그인이 figma.createNodeFromSvg 로
   * 진짜 편집 가능한 벡터 레이어로 만든다(아이콘 보존). currentColor 는 추출 시점의
   * computed color 로 치환돼 들어온다(Figma 는 currentColor 를 검정으로 처리하므로).
   */
  svg?: string;
  /** frame 자식(트리). leaf(text/image/svg)에는 없다. */
  children?: FigmaSceneNode[];
  /** frame 이 flex 컨테이너면 Auto Layout 스펙(없으면 자식은 절대배치). */
  layout?: FigmaLayout | null;
  /**
   * CSS position:absolute/fixed — flex 흐름에서 빠진 요소. Auto Layout 부모 안에서는
   * 플러그인이 layoutPositioning="ABSOLUTE" + 절대좌표로 배치해 흐름을 흩뜨리지 않게 한다.
   */
  absolute?: boolean;
  /** 가장 가까운 nds-* 조상에서 유도한 DS 컴포넌트명(레이어 명명 + Phase 3 승격용). */
  dsComponent?: string | null;
  props?: Record<string, string>;
}

export interface FigmaScene {
  version: number;
  /** 추출 시각 viewport 기준 전체 캔버스 크기. */
  width: number;
  height: number;
  /** body 가 flex 면 root 프레임에 적용할 Auto Layout(없으면 top-level 절대배치). */
  rootLayout?: FigmaLayout | null;
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
 * 추출 규칙(트리, 노이즈 최소화):
 *  - 보이는 요소만(display/visibility/opacity/0-size 제외, data-nds-stamp 바 제외).
 *  - <svg> → svg 노드(마크업 통째, 자식 비순회) → 플러그인이 벡터로 복원(아이콘 보존).
 *  - <img> 및 data: 배경이미지 → image 노드(leaf).
 *  - 직접 텍스트 런(텍스트 노드)은 Range 로 실제 박스를 재서 text 노드로(폰트/색/정렬 포함).
 *  - flex 컨테이너 → layout 단 frame, 자식 품음(Auto Layout). 시각요소(배경/보더/radius)
 *    있는 요소 → frame.
 *  - 그 외 투명 래퍼는 평탄화: 부모가 flex 가 아니면 자식을 부모로 끌어올린다(div soup 방지).
 *    부모가 flex 면 플렉스 아이템 수를 보존해야 하므로 투명 프레임으로 1개 묶음 유지.
 */
export function buildFigmaSceneScript(): string {
  return `(function () {
  var rootEl = document.body;
  var rootRect = rootEl.getBoundingClientRect();
  var W = Math.max(rootEl.scrollWidth, Math.ceil(rootRect.width)) || Math.ceil(rootRect.width);
  var H = Math.max(rootEl.scrollHeight, Math.ceil(rootRect.height)) || Math.ceil(rootRect.height);
  var CAP = ${MAX_SCENE_NODES};
  var count = 0;

  function px(v) { var n = parseFloat(v); return isFinite(n) ? n : 0; }
  function visibleFill(bg) {
    return bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
  }
  // 변별로 "보이는" 보더만 잰다(style!==none). 한 변만 있는 구분선(예: 게시글 사이
  // border-bottom)도 잡되, per-side 두께를 보존해 플러그인이 전체 박스로 칠하지 않게 한다.
  function borderOf(cs) {
    var t = cs.borderTopStyle !== "none" ? px(cs.borderTopWidth) : 0;
    var r = cs.borderRightStyle !== "none" ? px(cs.borderRightWidth) : 0;
    var b = cs.borderBottomStyle !== "none" ? px(cs.borderBottomWidth) : 0;
    var l = cs.borderLeftStyle !== "none" ? px(cs.borderLeftWidth) : 0;
    if (t + r + b + l <= 0) return null;
    var color = b ? cs.borderBottomColor : t ? cs.borderTopColor : l ? cs.borderLeftColor : cs.borderRightColor;
    return { color: color, weight: Math.max(t, r, b, l), top: t, right: r, bottom: b, left: l, uniform: t === r && r === b && b === l };
  }
  function isFlex(cs) { return (cs.display || "").indexOf("flex") !== -1; }
  // flex computed style → Auto Layout 스펙.
  function layoutOf(cs) {
    if (!isFlex(cs)) return null;
    var dir = cs.flexDirection || "row";
    var vertical = dir.indexOf("column") === 0;
    var gapSrc = vertical
      ? (cs.rowGap && cs.rowGap !== "normal" ? cs.rowGap : cs.gap)
      : (cs.columnGap && cs.columnGap !== "normal" ? cs.columnGap : cs.gap);
    var jc = cs.justifyContent || "flex-start";
    var primary =
      jc.indexOf("between") !== -1 || jc.indexOf("around") !== -1 || jc.indexOf("evenly") !== -1 ? "SPACE_BETWEEN"
      : jc.indexOf("center") !== -1 ? "CENTER"
      : jc.indexOf("end") !== -1 ? "MAX" : "MIN";
    var ai = cs.alignItems || "stretch";
    var counter =
      ai.indexOf("center") !== -1 ? "CENTER"
      : ai.indexOf("end") !== -1 ? "MAX"
      : (!vertical && ai.indexOf("baseline") !== -1) ? "BASELINE" : "MIN";
    return {
      mode: vertical ? "VERTICAL" : "HORIZONTAL",
      gap: px(gapSrc),
      padTop: px(cs.paddingTop), padRight: px(cs.paddingRight),
      padBottom: px(cs.paddingBottom), padLeft: px(cs.paddingLeft),
      primary: primary, counter: counter,
      // 주의: "nowrap" 도 "wrap" 을 부분문자열로 포함하므로 indexOf 로 보면 안 된다
      // (모든 flex 가 wrap=true 가 돼 플러그인 오토레이아웃이 깨졌던 버그). 정확 매칭.
      wrap: cs.flexWrap === "wrap" || cs.flexWrap === "wrap-reverse",
    };
  }
  // kebab nds-tag → PascalCase (ndsTagToComponentName 규칙 미러, 브라우저 인라인).
  // 연속 대문자 약어는 단순 변환이 안 돼 alias 보정 (parser.ts NDS_TAG_TO_REACT_ALIAS 와 동일 셋).
  var NDS_TAG_ALIAS = { "nds-fab": "FAB", "nds-ds-highlight": "DSHighlight" };
  function dsNameFor(el) {
    var node = el;
    while (node && node.tagName) {
      var tag = node.tagName.toLowerCase();
      if (tag.indexOf("nds-") === 0) {
        if (NDS_TAG_ALIAS[tag]) return NDS_TAG_ALIAS[tag];
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
  function box(el) {
    var r = el.getBoundingClientRect();
    return {
      x: Math.round(r.left - rootRect.left),
      y: Math.round(r.top - rootRect.top),
      w: Math.round(r.width),
      h: Math.round(r.height),
    };
  }
  // 텍스트 런(텍스트 노드)의 실제 렌더 박스 — Range 로 잰다(부모 박스보다 타이트·정확).
  function textRunBox(textNode) {
    try {
      var range = document.createRange();
      range.selectNodeContents(textNode);
      var r = range.getBoundingClientRect();
      return {
        x: Math.round(r.left - rootRect.left),
        y: Math.round(r.top - rootRect.top),
        w: Math.round(r.width),
        h: Math.round(r.height),
      };
    } catch (e) { return null; }
  }
  function textRunNode(s, tb, cs, ds) {
    var lh = cs.lineHeight === "normal" ? null : px(cs.lineHeight);
    return {
      type: "text",
      name: s.length > 24 ? s.slice(0, 24) + "\\u2026" : s,
      x: tb.x, y: tb.y, w: tb.w, h: tb.h,
      text: s,
      font: {
        family: (cs.fontFamily.split(",")[0] || "").replace(/['"]/g, "").trim(),
        size: px(cs.fontSize),
        weight: parseInt(cs.fontWeight, 10) || 400,
        color: cs.color,
        lineHeight: lh,
        align: cs.textAlign,
      },
      dsComponent: ds,
    };
  }
  function dataUrlFromBg(bg) {
    var m = /url\\((['"]?)(data:[^'")]+)\\1\\)/.exec(bg);
    return m ? m[2] : null;
  }
  // SVG data URL → 원본 <svg> 마크업(base64/percent-encoded 모두). SVG 아니면 null.
  function svgFromDataUrl(url) {
    if (!url || url.indexOf("data:image/svg+xml") !== 0) return null;
    var comma = url.indexOf(",");
    if (comma === -1) return null;
    try {
      var head = url.slice(0, comma);
      var body = url.slice(comma + 1);
      var svg = head.indexOf(";base64") !== -1 ? atob(body) : decodeURIComponent(body);
      return svg.indexOf("<svg") !== -1 ? svg : null;
    } catch (e) {
      return null;
    }
  }

  // 한 요소를 노드 / 평탄화된 노드 배열 / null 로 변환.
  // parentFlex=true 면 평탄화 금지(플렉스 아이템 1개로 보존).
  // parentDs = 부모 쪽에서 내려온 "가장 가까운 nds 컴포넌트명". 같은 이름이면 같은 컴포넌트
  // 내부이므로 dsComponent 를 다시 달지 않는다(레이어명/메타 과다 중복 방지 = "루트만 태깅").
  function build(el, parentFlex, parentDs) {
    if (count >= CAP || el.nodeType !== 1) return null;
    var tag = el.tagName.toLowerCase();
    if (tag === "script" || tag === "style" || tag === "noscript" || tag === "template") return null;
    if (el.getAttribute && el.getAttribute("data-nds-stamp") !== null) return null;
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return null;
    // display:contents 요소(대부분의 nds-* 커스텀 엘리먼트)는 자기 박스를 만들지 않아
    // getBoundingClientRect 가 0×0 이다. 0-size 가드로 떨구면 자식(실제 시각·이미지를
    // 든 내부 div)까지 통째로 사라진다 → 박스 없는 패스스루로 보고 아래에서 평탄화한다.
    var isContents = cs.display === "contents";
    var b = box(el);
    if (!isContents && (b.w < 1 || b.h < 1)) return null;
    var ds = dsNameFor(el);
    // 이 노드가 컴포넌트 "루트"일 때만 태깅 — 부모가 이미 같은 컴포넌트면(=내부 자손) 비태깅.
    var dsTag = ds && ds !== parentDs ? ds : null;
    var radius = px(cs.borderTopLeftRadius);
    var absolute = cs.position === "absolute" || cs.position === "fixed";

    // form 컨트롤: placeholder / value 는 DOM 텍스트 노드가 아니라 "속성"이라 텍스트 런
    // 순회로는 안 잡힌다 → 입력칸이 빈 상자로만 나오던 회귀. 단 "텍스트형" 입력만 대상:
    // radio / checkbox / range / file 등은 value 가 보이는 글자가 아니라(예: "under3m")
    // 레이어로 새므로 제외하고 일반 경로(시각 박스)로 흘려보낸다.
    if (tag === "input" || tag === "textarea") {
      var itype = (el.getAttribute("type") || "text").toLowerCase();
      var isTextInput = tag === "textarea" ||
        "|text|search|email|tel|url|password|number|".indexOf("|" + itype + "|") !== -1;
      if (isTextInput) {
        var hasVal = el.value != null && String(el.value) !== "";
        var shown = hasVal ? String(el.value) : el.placeholder || "";
        var fpadL = px(cs.paddingLeft), fpadR = px(cs.paddingRight), fpadT = px(cs.paddingTop);
        var fsize = px(cs.fontSize) || 14;
        var fline = Math.round(fsize * 1.4);
        var fieldKids = [];
        if (shown) {
          // 값은 텍스트색, placeholder 는 ::placeholder 의 실제 색(흐린 회색)을 그대로.
          var fcolor = cs.color;
          if (!hasVal) {
            try { fcolor = getComputedStyle(el, "::placeholder").color || cs.color; } catch (e2) { /* 무시 */ }
          }
          count++;
          fieldKids.push({
            type: "text",
            name: shown.length > 24 ? shown.slice(0, 24) + "\\u2026" : shown,
            // textarea 는 상단 정렬, 한 줄 input 은 세로 가운데.
            x: b.x + fpadL,
            y: tag === "textarea" ? b.y + fpadT : b.y + Math.max(0, Math.round((b.h - fline) / 2)),
            w: Math.max(1, b.w - fpadL - fpadR),
            h: fline,
            text: shown,
            font: {
              family: (cs.fontFamily.split(",")[0] || "").replace(/['"]/g, "").trim(),
              size: fsize,
              weight: parseInt(cs.fontWeight, 10) || 400,
              color: fcolor,
              lineHeight: cs.lineHeight === "normal" ? null : px(cs.lineHeight),
              align: cs.textAlign,
            },
            dsComponent: null,
          });
        }
        // 입력칸 자체는 "고정폭/높이 프레임"으로 방출 — 오토레이아웃에서 placeholder 텍스트가
        // hug 로 줄어들어도(검색 아이콘이 딱 붙는 회귀) 입력칸 폭이 유지돼 옆 아이콘이 우측에
        // 밀린 위치를 지키고, textarea 는 입력 영역 높이(예: 120px)가 그대로 보존된다.
        count++;
        return {
          type: "frame",
          name: dsTag || tag,
          x: b.x, y: b.y, w: b.w, h: b.h,
          fill: visibleFill(cs.backgroundColor) ? cs.backgroundColor : null,
          stroke: null,
          radius: radius,
          absolute: absolute,
          dsComponent: dsTag,
          children: fieldKids,
        };
      }
    }

    // leaf: svg(아이콘) → 마크업 통째, currentColor 는 computed color 로 치환.
    if (tag === "svg") {
      count++;
      var svgMarkup = (el.outerHTML || "").split("currentColor").join(cs.color);
      return { type: "svg", name: dsTag || "icon", x: b.x, y: b.y, w: b.w, h: b.h, svg: svgMarkup, absolute: absolute, dsComponent: dsTag };
    }
    // leaf: image. SVG data URL(예: 브랜드 로고 <img src="data:image/svg+xml...">)은
    // raster 가 아니라 벡터 — figma.createImage 가 SVG 를 못 받아 회색 박스로 폴백되던
    // 원인. → svg 노드로 방출해 플러그인이 createNodeFromSvg 로 진짜 로고를 만들게 한다.
    if (tag === "img" && el.currentSrc && el.currentSrc.indexOf("data:") === 0) {
      count++;
      var imgSvg = svgFromDataUrl(el.currentSrc);
      if (imgSvg) return { type: "svg", name: dsTag || "icon", x: b.x, y: b.y, w: b.w, h: b.h, svg: imgSvg, absolute: absolute, dsComponent: dsTag };
      return { type: "image", name: dsTag || "image", x: b.x, y: b.y, w: b.w, h: b.h, image: el.currentSrc, radius: radius, absolute: absolute, dsComponent: dsTag };
    }
    var bgImg = !isContents && cs.backgroundImage && cs.backgroundImage !== "none" ? dataUrlFromBg(cs.backgroundImage) : null;
    if (bgImg) {
      count++;
      var bgSvg = svgFromDataUrl(bgImg);
      if (bgSvg) return { type: "svg", name: dsTag || tag, x: b.x, y: b.y, w: b.w, h: b.h, svg: bgSvg, absolute: absolute, dsComponent: dsTag };
      return { type: "image", name: dsTag || tag, x: b.x, y: b.y, w: b.w, h: b.h, image: bgImg, radius: radius, absolute: absolute, dsComponent: dsTag };
    }

    var flex = isFlex(cs);
    var fill = visibleFill(cs.backgroundColor) ? cs.backgroundColor : null;
    var stroke = borderOf(cs);
    var hasVisual = !!(fill || stroke || radius > 0);
    // 이 요소가 실제 프레임으로 방출되면(=컴포넌트 박스) 자식의 부모 컨텍스트를 ds 로 갱신하고,
    // 평탄화(contents/투명 래퍼)되면 자식이 이 요소를 건너뛰므로 parentDs 를 그대로 물려준다.
    var willEmit = !isContents && (hasVisual || flex);
    var childDs = willEmit ? ds : parentDs;

    // 자식 수집(텍스트 런 + 요소). childNodes 순회로 문서 순서 보존(아이콘+라벨 순서 등).
    var kids = [];
    var ch = el.childNodes;
    for (var i = 0; i < ch.length; i++) {
      if (count >= CAP) break;
      var node = ch[i];
      if (node.nodeType === 3) {
        var s = (node.nodeValue || "").replace(/\\s+/g, " ").trim();
        if (s) {
          var tb = textRunBox(node);
          if (tb && tb.w >= 1 && tb.h >= 1) {
            count++;
            // 텍스트 런도 루트 경계에서만 태깅(=프레임으로 안 싸이는 텍스트 전용 컴포넌트).
            var textTag = ds && ds !== childDs ? ds : null;
            kids.push(textRunNode(s, tb, cs, textTag));
          }
        }
      } else if (node.nodeType === 1) {
        var r = build(node, flex, childDs);
        if (r) {
          if (r.length !== undefined && r.type === undefined) { for (var k = 0; k < r.length; k++) kids.push(r[k]); }
          else kids.push(r);
        }
      }
    }

    function makeFrame(withLayout) {
      count++;
      var op = parseFloat(cs.opacity);
      var n = { type: "frame", name: dsTag || tag, x: b.x, y: b.y, w: b.w, h: b.h, fill: fill, stroke: stroke, radius: radius, absolute: absolute, dsComponent: dsTag, children: kids };
      if (op < 1) n.opacity = op;
      if (withLayout) n.layout = layoutOf(cs);
      if (dsTag) { var p = dataProps(el); if (Object.keys(p).length) n.props = p; }
      return n;
    }

    // display:contents → 자기 프레임 없이 자식을 부모로 평탄화(자식 각각이 부모의
    // 흐름/플렉스 아이템으로 그대로 승격된다 — 이게 display:contents 의 정의). DS 커스텀
    // 엘리먼트(nds-card/select/banner/badge…)가 전부 이 경로 — 자식 div 가 실제 시각·이미지.
    if (isContents) {
      if (kids.length === 0) return null;
      if (kids.length === 1) return kids[0];
      return kids;
    }

    // 시각 스타일 있거나 flex → 프레임으로 방출(flex 면 layout 동반).
    if (hasVisual || flex) return makeFrame(flex);

    // 투명 래퍼.
    if (parentFlex) {
      if (kids.length === 0) return null;
      if (kids.length === 1) return kids[0];
      return makeFrame(false); // 플렉스 아이템 1개로 묶음(투명 프레임)
    }
    // 부모가 flex 아님 → 평탄화(자식을 위로).
    if (kids.length === 0) return null;
    if (kids.length === 1) return kids[0];
    return kids; // 프래그먼트(배열)
  }

  var bodyCs = getComputedStyle(rootEl);
  var bodyFlex = isFlex(bodyCs);
  var topKids = [];
  var bch = rootEl.children;
  for (var bi = 0; bi < bch.length; bi++) {
    if (count >= CAP) break;
    var tr = build(bch[bi], bodyFlex, null);
    if (tr) {
      if (tr.length !== undefined && tr.type === undefined) { for (var tk = 0; tk < tr.length; tk++) topKids.push(tr[tk]); }
      else topKids.push(tr);
    }
  }
  return { version: 1, width: W, height: H, rootLayout: bodyFlex ? layoutOf(bodyCs) : null, nodes: topKids };
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
  svg?: unknown;
  children?: unknown;
  layout?: unknown;
  absolute?: unknown;
  dsComponent?: unknown;
  props?: unknown;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && isFinite(v) ? v : fallback;
}

const PRIMARY_ALIGN = ["MIN", "CENTER", "MAX", "SPACE_BETWEEN"];
const COUNTER_ALIGN = ["MIN", "CENTER", "MAX", "BASELINE"];

/** raw layout 검증 → FigmaLayout 또는 null. mode 가 없으면 layout 자체를 버린다. */
function cleanLayout(raw: unknown): FigmaLayout | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const mode = r.mode === "VERTICAL" ? "VERTICAL" : r.mode === "HORIZONTAL" ? "HORIZONTAL" : null;
  if (!mode) return null;
  const primary = (
    PRIMARY_ALIGN.includes(r.primary as string) ? r.primary : "MIN"
  ) as FigmaLayout["primary"];
  const counter = (
    COUNTER_ALIGN.includes(r.counter as string) ? r.counter : "MIN"
  ) as FigmaLayout["counter"];
  return {
    mode,
    gap: Math.max(0, num(r.gap)),
    padTop: Math.max(0, num(r.padTop)),
    padRight: Math.max(0, num(r.padRight)),
    padBottom: Math.max(0, num(r.padBottom)),
    padLeft: Math.max(0, num(r.padLeft)),
    primary,
    counter,
    wrap: r.wrap === true,
  };
}

function cleanNode(raw: RawNode, ctr: { n: number }): FigmaSceneNode | null {
  if (ctr.n >= MAX_SCENE_NODES) return null;
  const type = raw.type;
  if (type !== "frame" && type !== "text" && type !== "image" && type !== "svg") return null;
  const w = num(raw.w);
  const h = num(raw.h);
  if (w < 1 || h < 1) return null;
  ctr.n++;

  const node: FigmaSceneNode = {
    type,
    name: typeof raw.name === "string" && raw.name ? raw.name : type,
    x: Math.round(num(raw.x)),
    y: Math.round(num(raw.y)),
    w: Math.round(w),
    h: Math.round(h),
  };
  if (typeof raw.dsComponent === "string") node.dsComponent = raw.dsComponent;
  if (raw.absolute === true) node.absolute = true;
  if (typeof raw.radius === "number" && raw.radius > 0) node.radius = Math.round(num(raw.radius));
  if (typeof raw.opacity === "number" && raw.opacity < 1) node.opacity = raw.opacity;

  if (type === "frame") {
    if (typeof raw.fill === "string") node.fill = raw.fill;
    const s = raw.stroke as
      | {
          color?: unknown;
          weight?: unknown;
          top?: unknown;
          right?: unknown;
          bottom?: unknown;
          left?: unknown;
          uniform?: unknown;
        }
      | null
      | undefined;
    if (s && typeof s.color === "string") {
      const t = Math.max(0, num(s.top));
      const r = Math.max(0, num(s.right));
      const b = Math.max(0, num(s.bottom));
      const l = Math.max(0, num(s.left));
      const anySide = t + r + b + l > 0;
      node.stroke = {
        color: s.color,
        weight: num(s.weight, 1),
        top: t,
        right: r,
        bottom: b,
        left: l,
        // 변별 정보가 없던 옛 데이터는 uniform 취급(전체 박스 보더 = 종전 동작).
        uniform: anySide ? s.uniform === true || (t === r && r === b && b === l) : true,
      };
    }
    if (raw.props && typeof raw.props === "object")
      node.props = raw.props as Record<string, string>;
    const lyt = cleanLayout(raw.layout);
    if (lyt) node.layout = lyt;
    if (Array.isArray(raw.children) && raw.children.length) {
      const kids: FigmaSceneNode[] = [];
      for (const rk of raw.children as RawNode[]) {
        if (ctr.n >= MAX_SCENE_NODES) break;
        const c = cleanNode(rk ?? {}, ctr);
        if (c) kids.push(c);
      }
      if (kids.length) node.children = kids;
    }
  } else if (type === "image") {
    // data: URL 만 통과(외부 URL 은 무유출 기조상 버린다 → 빈 박스 회귀).
    if (typeof raw.image === "string" && raw.image.startsWith("data:")) node.image = raw.image;
    else return null;
  } else if (type === "svg") {
    // <svg> 마크업. 비어 있으면 떨군다.
    if (typeof raw.svg === "string" && raw.svg.trim()) node.svg = raw.svg;
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
  const ctr = { n: 0 };
  const nodes: FigmaSceneNode[] = [];
  for (const rn of rawNodes) {
    if (ctr.n >= MAX_SCENE_NODES) break;
    const cleaned = cleanNode(rn ?? {}, ctr);
    if (cleaned) nodes.push(cleaned);
  }
  return {
    version: num(r.version, 1),
    width: Math.max(1, Math.round(num(r.width, 1))),
    height: Math.max(1, Math.round(num(r.height, 1))),
    rootLayout: cleanLayout((r as { rootLayout?: unknown }).rootLayout),
    nodes,
  };
}
