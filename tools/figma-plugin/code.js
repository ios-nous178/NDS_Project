/**
 * Nudge Mockup 가져오기 (canary) — code.js (plugin main, plain JS, 무빌드).
 * (Figma 코드 검사기는 동적 모듈 로드 호출 패턴을 거부하므로 그 단어/패턴을 코드에 넣지 않는다.)
 *
 * 데스크탑 앱이 추출한 scene.json(평면 레이어)을 Figma 캔버스에 짓는다. scene 스키마는
 * packages/mockup-core/src/tools/figma/scene.ts 의 FigmaScene 과 1:1.
 *
 * 이미지 디코드(data: URL → bytes)는 DOM 이 있는 UI(iframe)에서 처리해 넘겨받는다
 * (플러그인 샌드박스엔 atob/fetch 가 없음). 네트워크 접근 없음 — 전부 로컬.
 */

figma.showUI(__html__, { width: 360, height: 280, title: "Nudge Mockup 가져오기 (canary)" });

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

/** CSS rgb()/rgba() → { color:{r,g,b}, opacity }. 파싱 실패 시 null. */
function parseColor(css) {
  if (!css || typeof css !== "string") return null;
  var m = /rgba?\(([^)]+)\)/.exec(css);
  if (!m) return null;
  var parts = m[1].split(",").map(function (s) {
    return parseFloat(s.trim());
  });
  if (
    parts.length < 3 ||
    parts.some(function (n) {
      return isNaN(n);
    })
  )
    return null;
  return {
    color: { r: clamp01(parts[0] / 255), g: clamp01(parts[1] / 255), b: clamp01(parts[2] / 255) },
    opacity: parts.length >= 4 ? clamp01(parts[3]) : 1,
  };
}

function solidPaint(css, fallbackOpacity) {
  var c = parseColor(css);
  if (!c) return null;
  return {
    type: "SOLID",
    color: c.color,
    opacity: fallbackOpacity != null ? fallbackOpacity : c.opacity,
  };
}

var ALIGN = { left: "LEFT", center: "CENTER", right: "RIGHT", justify: "JUSTIFIED" };

/** 스타일명 정규화 — 공백/하이픈/언더스코어 제거 + 소문자. "Semi Bold" == "SemiBold". */
function normStyle(s) {
  return String(s == null ? "" : s)
    .toLowerCase()
    .replace(/[\s\-_]/g, "");
}

/**
 * CSS font-weight → 우선순위 스타일 후보(정규화). 폰트마다 등록명이 달라서
 * (예: 600 → "SemiBold" / "Semi Bold" / "DemiBold") 여러 변형을 순서대로 시도하고,
 * 끝에 Regular 를 가족 내 폴백으로 둔다.
 */
function styleCandidates(weight) {
  var w = Math.round((weight || 400) / 100) * 100;
  if (w < 100) w = 100;
  if (w > 900) w = 900;
  var byWeight = {
    100: ["Thin", "Hairline"],
    200: ["ExtraLight", "UltraLight"],
    300: ["Light"],
    400: ["Regular", "Normal", "Book"],
    500: ["Medium"],
    600: ["SemiBold", "DemiBold"],
    700: ["Bold"],
    800: ["ExtraBold", "UltraBold"],
    900: ["Black", "Heavy"],
  };
  var list = (byWeight[w] || ["Regular"]).slice();
  if (list.indexOf("Regular") === -1) list.push("Regular");
  return list.map(normStyle);
}

// 사용 가능한 폰트 인덱스: { familyLower: { normStyle: fontName } }. 1회 로드 후 캐시.
var _fontIndex = null;
async function fontIndex() {
  if (_fontIndex) return _fontIndex;
  _fontIndex = {};
  try {
    var list = await figma.listAvailableFontsAsync();
    for (var i = 0; i < list.length; i++) {
      var fn = list[i].fontName;
      var fam = fn.family.toLowerCase();
      if (!_fontIndex[fam]) _fontIndex[fam] = {};
      var k = normStyle(fn.style);
      if (!(k in _fontIndex[fam])) _fontIndex[fam][k] = fn;
    }
  } catch (_e) {
    /* 목록 실패 시 빈 인덱스 → Inter Regular 로 폴백 */
  }
  return _fontIndex;
}

/**
 * 요청 family+weight 에 "실제 사용 가능한" 가장 가까운 폰트를 로드한다.
 *   ① 요청 family 안에서 weight 후보 스타일 매칭(공백/하이픈 무시)
 *   ② 같은 방식으로 Inter 매칭  ③ Inter Regular.
 * 사용자가 프로젝트 폰트를 로컬 설치(또는 조직 공유)했으면 ①에서 잡혀 폴백이 안 일어난다.
 * 실제 로드된 fontName 을 반환(전부 실패 시 null).
 */
async function ensureFont(family, weight) {
  var idx = await fontIndex();
  var cands = styleCandidates(weight);
  var families = [family, "Inter"];
  for (var f = 0; f < families.length; f++) {
    var styles = idx[(families[f] || "").toLowerCase()];
    if (!styles) continue;
    for (var c = 0; c < cands.length; c++) {
      var hit = styles[cands[c]];
      if (hit) {
        try {
          await figma.loadFontAsync(hit);
          return hit;
        } catch (_e) {
          /* 다음 후보 */
        }
      }
    }
  }
  var fallback = { family: "Inter", style: "Regular" };
  try {
    await figma.loadFontAsync(fallback);
    return fallback;
  } catch (_e) {
    return null;
  }
}

/** 트리를 순회하며 모든 text 노드의 (family,weight)를 미리 로드한다(중복 제거). */
async function preloadFonts(nodes, fontCache) {
  for (var i = 0; i < nodes.length; i++) {
    var n = nodes[i];
    if (n.type === "text" && n.font) {
      var fam = n.font.family || "Inter";
      var wt = n.font.weight || 400;
      var key = fam + "|" + wt;
      if (!(key in fontCache)) fontCache[key] = await ensureFont(fam, wt);
    }
    if (n.children && n.children.length) await preloadFonts(n.children, fontCache);
  }
}

/** flex 노드의 layout 스펙을 Figma Auto Layout 으로 적용(자식 append 후 호출). */
function applyLayout(frame, L, w, h) {
  try {
    frame.layoutMode = L.mode;
    frame.itemSpacing = Math.max(0, L.gap || 0);
    frame.paddingTop = Math.max(0, L.padTop || 0);
    frame.paddingRight = Math.max(0, L.padRight || 0);
    frame.paddingBottom = Math.max(0, L.padBottom || 0);
    frame.paddingLeft = Math.max(0, L.padLeft || 0);
    frame.primaryAxisAlignItems = L.primary || "MIN";
    // BASELINE 은 가로축에서만 유효 → 세로면 MIN 으로.
    frame.counterAxisAlignItems =
      L.counter === "BASELINE" && L.mode !== "HORIZONTAL" ? "MIN" : L.counter || "MIN";
    frame.layoutWrap = L.wrap ? "WRAP" : "NO_WRAP";
    // 캡처한 원본 크기를 유지(자식에 맞춰 hug 되지 않게 FIXED). 단 WRAP 이면 counter 축을
    // FIXED 로 두는 건 Figma 가 거부(throw)하므로 AUTO(hug) 로 둬야 applyLayout 이 안 깨진다.
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = L.wrap ? "AUTO" : "FIXED";
    frame.resize(Math.max(0.01, w), Math.max(0.01, h));
  } catch (_e) {
    /* 그래도 실패하면 자식은 appendChildNode 가 미리 박아둔 절대좌표로 남는다(쏠림 방지) */
  }
}

async function renderScene(scene) {
  if (!scene || !Array.isArray(scene.nodes)) {
    figma.notify("scene.json 형식이 올바르지 않습니다.");
    return;
  }

  var fontCache = {};
  await preloadFonts(scene.nodes, fontCache);

  var root = figma.createFrame();
  root.name = "Mockup 가져오기 (canary)";
  root.resize(Math.max(1, scene.width || 1), Math.max(1, scene.height || 1));
  root.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  root.clipsContent = false;

  var counter = { made: 0 };
  // root 의 절대 좌표 원점은 (0,0) — top-level 노드의 절대좌표를 그대로 쓴다.
  var rootNode = { x: 0, y: 0, layout: scene.rootLayout || null };
  for (var j = 0; j < scene.nodes.length; j++) {
    appendChildNode(root, rootNode, scene.nodes[j], fontCache, counter);
  }
  if (scene.rootLayout) applyLayout(root, scene.rootLayout, root.width, root.height);

  figma.currentPage.appendChild(root);
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("가져오기 완료 · 레이어 " + counter.made + "개");
}

/** childNode 를 만들어 parent 에 붙이고 배치한다(부모가 Auto Layout 이면 좌표 생략). */
function appendChildNode(parentFrame, parentNode, childNode, fontCache, counter) {
  var el;
  try {
    el = buildNode(childNode, fontCache, counter);
  } catch (_e) {
    el = null; // 한 노드 실패가 전체를 막지 않게
  }
  if (!el) return;
  parentFrame.appendChild(el);
  counter.made++;
  var relX = (childNode.x || 0) - (parentNode.x || 0);
  var relY = (childNode.y || 0) - (parentNode.y || 0);
  // 항상 상대좌표를 먼저 박는다 — 이 시점엔 부모가 아직 plain frame 이다. 부모가 Auto
  // Layout 이면 뒤이은 applyLayout 이 흐름배치로 덮어쓰지만, applyLayout 이 실패해도
  // 좌표가 남아 자식이 (0,0) 으로 쏠리지 않는다(과거 wrap 버그로 헤더가 무너지던 원인).
  try {
    el.x = relX;
    el.y = relY;
  } catch (_e3) {
    /* createNodeFromSvg 등 일부는 x/y 세터가 막힐 수 있음 */
  }
  // Auto Layout 부모 안의 position:absolute 였던 자식은 흐름에서 빼서 절대배치 유지.
  if (parentNode.layout && childNode.absolute) {
    try {
      el.layoutPositioning = "ABSOLUTE";
      el.x = relX;
      el.y = relY;
    } catch (_e2) {
      /* 무시 */
    }
  }
}

function buildNode(node, fontCache, counter) {
  var w = Math.max(1, node.w || 1);
  var h = Math.max(1, node.h || 1);

  // svg(아이콘) → 진짜 벡터 노드.
  if (node.type === "svg" && node.svg) {
    var svgNode;
    try {
      svgNode = figma.createNodeFromSvg(node.svg);
    } catch (_e) {
      return null;
    }
    svgNode.name = node.name || "icon";
    try {
      svgNode.resize(w, h);
    } catch (_e2) {
      /* 최소크기 이슈 무시 */
    }
    return svgNode;
  }

  if (node.type === "image" && node.bytes) {
    var rect = figma.createRectangle();
    rect.name = node.name || "image";
    rect.resize(w, h);
    if (node.radius) rect.cornerRadius = node.radius;
    try {
      var img = figma.createImage(new Uint8Array(node.bytes));
      rect.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: img.hash }];
    } catch (_e) {
      rect.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    }
    return rect;
  }

  if (node.type === "text" && node.text) {
    var fam = node.font && node.font.family ? node.font.family : "Inter";
    var wt = node.font ? node.font.weight || 400 : 400;
    var loaded = fontCache[fam + "|" + wt];
    if (!loaded) return null;
    var t = figma.createText();
    t.fontName = loaded;
    t.characters = node.text;
    if (node.font) {
      if (node.font.size) t.fontSize = Math.max(1, node.font.size);
      var paint = solidPaint(node.font.color, 1);
      if (paint) t.fills = [paint];
      if (node.font.align && ALIGN[node.font.align]) t.textAlignHorizontal = ALIGN[node.font.align];
      if (node.font.lineHeight) t.lineHeight = { value: node.font.lineHeight, unit: "PIXELS" };
    }
    t.name = node.name || node.text.slice(0, 24);
    // 줄바꿈 방지: 원본이 한 줄(상자 높이 ≈ 한 줄)이면 hug(자동 너비) → 폴백 폰트가
    // 살짝 넓어도 "필수"→"필/수" 처럼 쪼개지지 않는다. 여러 줄이면 너비 고정 + 높이 자동.
    var lh =
      node.font && node.font.lineHeight
        ? node.font.lineHeight
        : node.font && node.font.size
          ? node.font.size * 1.3
          : h;
    if (h > lh * 1.6) {
      t.textAutoResize = "HEIGHT";
      try {
        t.resize(w, h);
      } catch (_e) {
        /* 무시 */
      }
    } else {
      t.textAutoResize = "WIDTH_AND_HEIGHT";
    }
    return t;
  }

  if (node.type === "frame") {
    var frame = figma.createFrame();
    frame.name = node.name || "frame";
    frame.resize(w, h);
    frame.clipsContent = false;
    if (node.opacity != null) frame.opacity = node.opacity;
    if (node.radius) frame.cornerRadius = node.radius;
    var fillPaint = node.fill ? solidPaint(node.fill) : null;
    frame.fills = fillPaint ? [fillPaint] : [];
    if (node.stroke && node.stroke.color) {
      var sp = solidPaint(node.stroke.color);
      if (sp) {
        frame.strokes = [sp];
        var st = node.stroke;
        var perSide =
          st.uniform === false &&
          (st.top != null || st.right != null || st.bottom != null || st.left != null);
        if (perSide) {
          // 한 변만 있는 구분선(border-bottom 등)을 전체 박스 보더로 칠하지 않게 변별 두께.
          try {
            frame.strokeAlign = "INSIDE"; // 개별 변 두께는 INSIDE 정렬에서만 유효.
            frame.strokeTopWeight = Math.max(0, st.top || 0);
            frame.strokeRightWeight = Math.max(0, st.right || 0);
            frame.strokeBottomWeight = Math.max(0, st.bottom || 0);
            frame.strokeLeftWeight = Math.max(0, st.left || 0);
          } catch (_eStroke) {
            frame.strokeWeight = Math.max(1, st.weight || 1);
          }
        } else {
          frame.strokeWeight = Math.max(1, st.weight || 1);
        }
      }
    }
    // 자식 재귀 → append + 배치.
    if (node.children && node.children.length) {
      for (var i = 0; i < node.children.length; i++) {
        appendChildNode(frame, node, node.children[i], fontCache, counter);
      }
    }
    // flex 면 Auto Layout 적용(자식 배치 후).
    if (node.layout) applyLayout(frame, node.layout, w, h);
    return frame;
  }

  return null;
}

figma.ui.onmessage = function (msg) {
  if (msg && msg.type === "render") {
    renderScene(msg.scene).catch(function (e) {
      figma.notify("가져오기 실패: " + (e && e.message ? e.message : e));
    });
  } else if (msg && msg.type === "close") {
    figma.closePlugin();
  }
};
