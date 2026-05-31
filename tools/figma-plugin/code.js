/**
 * Nudge Mockup Import (canary) — code.js (plugin main, plain JS, 무빌드).
 *
 * 데스크탑 앱이 추출한 scene.json(평면 레이어)을 Figma 캔버스에 짓는다. scene 스키마는
 * packages/mockup-core/src/tools/figma/scene.ts 의 FigmaScene 과 1:1.
 *
 * 이미지 디코드(data: URL → bytes)는 DOM 이 있는 UI(iframe)에서 처리해 넘겨받는다
 * (플러그인 샌드박스엔 atob/fetch 가 없음). 네트워크 접근 없음 — 전부 로컬.
 */

figma.showUI(__html__, { width: 360, height: 280, title: "Nudge Mockup Import (canary)" });

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

/** CSS font-weight → Figma 스타일 이름. */
function weightToStyle(w) {
  if (w >= 900) return "Black";
  if (w >= 800) return "Extra Bold";
  if (w >= 700) return "Bold";
  if (w >= 600) return "Semi Bold";
  if (w >= 500) return "Medium";
  if (w >= 300) return "Light";
  return "Regular";
}

var ALIGN = { left: "LEFT", center: "CENTER", right: "RIGHT", justify: "JUSTIFIED" };

/** family/style 로드 시도 → 실패하면 Inter 로 폴백. 실제 로드된 fontName 반환. */
async function ensureFont(family, style) {
  var attempts = [
    { family: family, style: style },
    { family: family, style: "Regular" },
    { family: "Inter", style: style },
    { family: "Inter", style: "Regular" },
  ];
  for (var i = 0; i < attempts.length; i++) {
    try {
      await figma.loadFontAsync(attempts[i]);
      return attempts[i];
    } catch {
      /* 다음 후보 */
    }
  }
  return null;
}

async function renderScene(scene) {
  if (!scene || !Array.isArray(scene.nodes)) {
    figma.notify("scene.json 형식이 올바르지 않습니다.");
    return;
  }

  // 텍스트 폰트를 미리 한 번씩 로드(중복 제거).
  var fontCache = {};
  for (var i = 0; i < scene.nodes.length; i++) {
    var n = scene.nodes[i];
    if (n.type === "text" && n.font) {
      var key = (n.font.family || "Inter") + "|" + weightToStyle(n.font.weight || 400);
      if (!fontCache[key]) {
        fontCache[key] = await ensureFont(
          n.font.family || "Inter",
          weightToStyle(n.font.weight || 400),
        );
      }
    }
  }

  var root = figma.createFrame();
  root.name = "Mockup import (canary)";
  root.resize(Math.max(1, scene.width || 1), Math.max(1, scene.height || 1));
  root.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  root.clipsContent = false;

  var made = 0;
  for (var j = 0; j < scene.nodes.length; j++) {
    var node = scene.nodes[j];
    try {
      var el = buildNode(node, fontCache);
      if (el) {
        root.appendChild(el);
        el.x = node.x || 0;
        el.y = node.y || 0;
        made++;
      }
    } catch {
      /* 한 노드 실패가 전체를 막지 않게 */
    }
  }

  figma.currentPage.appendChild(root);
  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.notify("가져오기 완료 · 레이어 " + made + "개");
}

function buildNode(node, fontCache) {
  var w = Math.max(1, node.w || 1);
  var h = Math.max(1, node.h || 1);

  if (node.type === "image" && node.bytes) {
    var rect = figma.createRectangle();
    rect.name = node.name || "image";
    rect.resize(w, h);
    if (node.radius) rect.cornerRadius = node.radius;
    try {
      var img = figma.createImage(new Uint8Array(node.bytes));
      rect.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: img.hash }];
    } catch {
      rect.fills = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.9 } }];
    }
    return rect;
  }

  if (node.type === "text" && node.text) {
    var loaded =
      fontCache[
        (node.font && node.font.family ? node.font.family : "Inter") +
          "|" +
          weightToStyle(node.font ? node.font.weight : 400)
      ];
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
    t.textAutoResize = "NONE";
    try {
      t.resize(w, h);
    } catch {
      /* 텍스트 최소크기 이슈 무시 */
    }
    return t;
  }

  // frame(시각 박스) → rectangle.
  if (node.type === "frame") {
    var box = figma.createRectangle();
    box.name = node.name || "box";
    box.resize(w, h);
    if (node.radius) box.cornerRadius = node.radius;
    if (node.opacity != null) box.opacity = node.opacity;
    var fillPaint = node.fill ? solidPaint(node.fill) : null;
    box.fills = fillPaint ? [fillPaint] : [];
    if (node.stroke && node.stroke.color) {
      var sp = solidPaint(node.stroke.color);
      if (sp) {
        box.strokes = [sp];
        box.strokeWeight = Math.max(1, node.stroke.weight || 1);
      }
    }
    return box;
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
