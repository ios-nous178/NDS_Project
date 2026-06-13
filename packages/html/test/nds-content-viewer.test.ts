/**
 * nds-content-viewer DOM 구조 및 sanitize/auto-attribute 동작 검증.
 */

import { describe, expect, it } from "vitest";
import { NdsContentViewer, stripDangerousHtml } from "../src/components/nds-content-viewer.js";

const flush = () => new Promise<void>((r) => setTimeout(r, 0));

describe("nds-content-viewer — DOM parity with React ContentViewer", () => {
  it("registers as a custom element", () => {
    expect(customElements.get("nds-content-viewer")).toBe(NdsContentViewer);
  });

  it("renders sanitized HTML into the root (strips dangerous tags, keeps text)", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("html", "<p>안녕<script>alert(1)</script></p>");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-content-viewer") as HTMLElement;
    expect(root.dataset.slot).toBe("root");
    // <script> 태그 자체는 제거되지만 내부 텍스트는 남는다 (React 동작과 패리티).
    expect(root.querySelector("script")).toBeNull();
    expect(root.querySelector("p")!.textContent).toBe("안녕alert(1)");
    expect(el.style.display).toBe("contents");
  });

  it("strips on*= inline handlers and javascript: URLs", () => {
    const out = stripDangerousHtml(
      `<a href="javascript:alert(1)" onclick="bad()">x</a><img onerror='boom()' src="x">`,
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/onclick/i);
    expect(out).not.toMatch(/onerror/i);
  });

  it("unwraps non-allowlisted tags but keeps their text (allowlist)", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("html", "<p>안녕 <font color='red'>강조</font> 끝</p>");
    document.body.appendChild(el);
    await flush();

    const root = el.querySelector(".nds-content-viewer") as HTMLElement;
    expect(root.querySelector("font")).toBeNull();
    expect(root.querySelector("p")!.textContent).toBe("안녕 강조 끝");
  });

  it("strips disallowed attributes (class/id/style) but keeps allowed ones", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("html", '<p class="x" id="y" style="color:red" title="ok">hi</p>');
    document.body.appendChild(el);
    await flush();

    const p = el.querySelector("p")!;
    expect(p.hasAttribute("class")).toBe(false);
    expect(p.hasAttribute("id")).toBe(false);
    expect(p.hasAttribute("style")).toBe(false);
    expect(p.getAttribute("title")).toBe("ok");
  });

  it("removes data:/unknown URL schemes on href/src, keeps http(s)/relative", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute(
      "html",
      '<a href="data:text/html,x">bad</a><a href="https://ok.com">ok</a>' +
        '<img src="data:image/svg+xml,x"><img src="/safe.png">',
    );
    document.body.appendChild(el);
    await flush();

    const anchors = el.querySelectorAll("a");
    expect(anchors[0].hasAttribute("href")).toBe(false);
    expect(anchors[1].getAttribute("href")).toBe("https://ok.com");
    const imgs = el.querySelectorAll("img");
    expect(imgs[0].hasAttribute("src")).toBe(false);
    expect(imgs[1].getAttribute("src")).toBe("/safe.png");
  });

  it("auto-applies loading=lazy and decoding=async on images", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("html", '<p><img src="/a.png"><img src="/b.png" loading="eager"></p>');
    document.body.appendChild(el);
    await flush();

    const imgs = el.querySelectorAll("img");
    expect(imgs[0].getAttribute("loading")).toBe("lazy");
    expect(imgs[0].getAttribute("decoding")).toBe("async");
    // 이미 지정된 loading 은 보존
    expect(imgs[1].getAttribute("loading")).toBe("eager");
  });

  it("auto-blanks external http(s) links and adds rel noopener noreferrer", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute(
      "html",
      '<a href="https://x.com">x</a><a href="/internal">in</a><a href="https://y.com" target="_self" rel="alt">y</a>',
    );
    document.body.appendChild(el);
    await flush();

    const anchors = el.querySelectorAll("a");
    expect(anchors[0].getAttribute("target")).toBe("_blank");
    expect(anchors[0].getAttribute("rel")).toContain("noopener");
    expect(anchors[0].getAttribute("rel")).toContain("noreferrer");

    expect(anchors[1].getAttribute("target")).toBeNull();

    // 이미 지정된 target 은 보존, rel 은 누락 토큰 추가
    expect(anchors[2].getAttribute("target")).toBe("_self");
    const rel = anchors[2].getAttribute("rel")!.split(/\s+/);
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
    expect(rel).toContain("alt");
  });

  it("no-sanitize disables dangerous-tag stripping", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("no-sanitize", "");
    el.setAttribute("html", "<p>x<style>p{color:red}</style></p>");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector("style")).not.toBeNull();
  });

  it("no-image-lazy keeps loading attribute untouched", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("no-image-lazy", "");
    el.setAttribute("html", '<p><img src="/x.png"></p>');
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector("img")!.getAttribute("loading")).toBeNull();
  });

  it("no-external-blank keeps external links as-is", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("no-external-blank", "");
    el.setAttribute("html", '<a href="https://x.com">x</a>');
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector("a")!.getAttribute("target")).toBeNull();
  });

  it("re-renders when html attribute changes", async () => {
    const el = document.createElement("nds-content-viewer");
    el.setAttribute("html", "<p>처음</p>");
    document.body.appendChild(el);
    await flush();
    expect(el.querySelector("p")!.textContent).toBe("처음");

    el.setAttribute("html", "<p>다음</p>");
    await flush();
    expect(el.querySelector("p")!.textContent).toBe("다음");
  });
});
