import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildFigmaSceneScript,
  normalizeScene,
  MAX_SCENE_NODES,
  type FigmaScene,
} from "./scene.js";

test("buildFigmaSceneScript: self-contained IIFE 문자열", () => {
  const src = buildFigmaSceneScript();
  assert.match(src, /^\(function \(\) \{/);
  assert.match(src, /\}\)\(\);$/);
  // 외부 의존 없이 DOM API 만 참조해야 한다.
  assert.ok(src.includes("document.body"));
  assert.ok(src.includes("getComputedStyle"));
  // 스탬프 바 제외 가드 + nds 컴포넌트 명명 + 노드 상한이 박혀 있어야 한다.
  assert.ok(src.includes("data-nds-stamp"));
  assert.ok(src.includes("nds-"));
  assert.ok(src.includes(String(MAX_SCENE_NODES)));
  // <svg> 아이콘 캡처 + currentColor 치환 로직이 박혀 있어야 한다.
  assert.ok(src.includes('"svg"'));
  assert.ok(src.includes("outerHTML"));
  assert.ok(src.includes("currentColor"));
  // 트리 빌더 + flex 레이아웃 + Range 기반 텍스트 박스.
  assert.ok(src.includes("selectNodeContents"));
  assert.ok(src.includes("flexDirection"));
  assert.ok(src.includes("rootLayout"));
});

test("normalizeScene: 트리(children) + flex layout 보존 / 잘못된 layout 드롭", () => {
  const scene = normalizeScene({
    width: 390,
    height: 844,
    rootLayout: { mode: "VERTICAL", gap: 16, primary: "MIN", counter: "MIN" },
    nodes: [
      {
        type: "frame",
        name: "Row",
        x: 0,
        y: 0,
        w: 300,
        h: 40,
        layout: {
          mode: "HORIZONTAL",
          gap: 8,
          padTop: 4,
          padLeft: 12,
          primary: "SPACE_BETWEEN",
          counter: "CENTER",
          wrap: false,
        },
        children: [
          { type: "svg", name: "Icon", x: 0, y: 0, w: 24, h: 24, svg: "<svg><path/></svg>" },
          {
            type: "text",
            name: "라벨",
            x: 30,
            y: 0,
            w: 60,
            h: 20,
            text: "라벨",
            font: { family: "Pretendard", size: 14, weight: 500, color: "rgb(0,0,0)" },
          },
        ],
      },
      // mode 없는 layout → 드롭(절대배치 프레임으로 남음).
      {
        type: "frame",
        name: "Bad",
        x: 0,
        y: 50,
        w: 10,
        h: 10,
        fill: "red",
        layout: { gap: 8 },
      },
    ],
  });
  assert.equal(scene.rootLayout?.mode, "VERTICAL");
  assert.equal(scene.rootLayout?.gap, 16);
  assert.equal(scene.nodes.length, 2);
  const row = scene.nodes[0];
  assert.equal(row.layout?.mode, "HORIZONTAL");
  assert.equal(row.layout?.primary, "SPACE_BETWEEN");
  assert.equal(row.layout?.counter, "CENTER");
  assert.equal(row.layout?.padLeft, 12);
  assert.equal(row.children?.length, 2);
  assert.equal(row.children?.[0].type, "svg");
  assert.equal(row.children?.[1].text, "라벨");
  // 잘못된 layout 은 떨어지고 프레임 자체는 남는다.
  assert.equal(scene.nodes[1].layout, undefined);
  assert.equal(scene.nodes[1].fill, "red");
});

test("normalizeScene: svg 노드 통과 + 빈 svg 드롭", () => {
  const scene = normalizeScene({
    nodes: [
      {
        type: "svg",
        name: "ChevronIcon",
        x: 4,
        y: 4,
        w: 24,
        h: 24,
        svg: '<svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
        dsComponent: "Icon",
      },
      { type: "svg", name: "empty", x: 0, y: 0, w: 16, h: 16, svg: "   " },
      { type: "svg", name: "missing", x: 0, y: 0, w: 16, h: 16 },
    ],
  });
  assert.equal(scene.nodes.length, 1);
  const [icon] = scene.nodes;
  assert.equal(icon.type, "svg");
  assert.equal(icon.name, "ChevronIcon");
  assert.equal(icon.dsComponent, "Icon");
  assert.match(icon.svg ?? "", /<path/);
});

test("normalizeScene: frame/text/image 통과 + 메타 보존", () => {
  const scene = normalizeScene({
    version: 1,
    width: 390,
    height: 844,
    nodes: [
      {
        type: "frame",
        name: "Button",
        x: 10,
        y: 20,
        w: 100,
        h: 48,
        fill: "rgb(255, 211, 61)",
        stroke: { color: "rgb(0,0,0)", weight: 1 },
        radius: 8,
        dsComponent: "Button",
        props: { color: "primary" },
      },
      {
        type: "text",
        name: "확인",
        x: 12,
        y: 30,
        w: 60,
        h: 20,
        text: "확인",
        font: {
          family: "Pretendard",
          size: 16,
          weight: 600,
          color: "rgb(0,0,0)",
          lineHeight: 24,
          align: "center",
        },
        dsComponent: "Button",
      },
      {
        type: "image",
        name: "logo",
        x: 0,
        y: 0,
        w: 120,
        h: 40,
        image: "data:image/png;base64,AAAA",
      },
    ],
  });
  assert.equal(scene.nodes.length, 3);
  const [frame, txt, img] = scene.nodes;
  assert.equal(frame.fill, "rgb(255, 211, 61)");
  assert.equal(frame.radius, 8);
  assert.deepEqual(frame.props, { color: "primary" });
  assert.equal(frame.dsComponent, "Button");
  assert.equal(txt.text, "확인");
  assert.equal(txt.font?.weight, 600);
  assert.equal(img.image, "data:image/png;base64,AAAA");
});

test("normalizeScene: 외부 URL 이미지/빈 텍스트/0-size 는 드롭", () => {
  const scene = normalizeScene({
    nodes: [
      {
        type: "image",
        name: "x",
        x: 0,
        y: 0,
        w: 10,
        h: 10,
        image: "https://cdn.example.com/a.png",
      },
      { type: "text", name: "x", x: 0, y: 0, w: 10, h: 10, text: "" },
      { type: "frame", name: "x", x: 0, y: 0, w: 0, h: 50, fill: "red" },
      { type: "bogus", x: 0, y: 0, w: 10, h: 10 },
      { type: "frame", name: "ok", x: 0, y: 0, w: 10, h: 10, fill: "red" },
    ],
  });
  assert.equal(scene.nodes.length, 1);
  assert.equal(scene.nodes[0].name, "ok");
});

test("normalizeScene: 깨진 입력에도 안전한 기본값", () => {
  const empty: FigmaScene = normalizeScene(null);
  assert.equal(empty.version, 1);
  assert.equal(empty.width, 1);
  assert.equal(empty.nodes.length, 0);
  assert.equal(normalizeScene({ nodes: "nope" }).nodes.length, 0);
});

test("normalizeScene: 노드 상한 적용", () => {
  const many = Array.from({ length: MAX_SCENE_NODES + 50 }, () => ({
    type: "frame",
    name: "f",
    x: 0,
    y: 0,
    w: 5,
    h: 5,
    fill: "red",
  }));
  const scene = normalizeScene({ nodes: many });
  assert.equal(scene.nodes.length, MAX_SCENE_NODES);
});
