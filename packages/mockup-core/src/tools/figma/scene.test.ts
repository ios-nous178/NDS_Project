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
