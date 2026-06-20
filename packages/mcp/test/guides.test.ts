import { afterEach, beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getGuide } from "../src/tools/guides.js";
import { resolveIntentRouting, resolveEffectiveIntent } from "../src/guides.js";
import { _resetSessionState, principlesAcked } from "../src/tools/session-state.js";
import { DESIGN_DECISIONS_FILE, type DesignDecisionRow } from "../src/tools/design-spec.js";

beforeEach(() => {
  _resetSessionState();
});

describe("getGuide", () => {
  it("supports batched topics and marks principles as called", () => {
    const result = getGuide({ topics: ["principles", "dos-donts"] });

    expect(result.topics).toBeTypeOf("object");
    expect((result.topics as Record<string, unknown>).principles).toBeTypeOf("object");
    expect((result.topics as Record<string, unknown>)["dos-donts"]).toBeTypeOf("object");
    expect(principlesAcked()).toBe(true);
  });

  it("adds a compact principles digest to component guides", () => {
    const result = getGuide({ topic: "component:Button", target: "html" });

    expect(result._principlesDigest).toEqual(
      expect.arrayContaining([
        "No emoji/text-symbol icons; use find_icon + @nudge-design/icons.",
        "Use semantic tokens; avoid raw hex/rgb and raw palette tokens.",
      ]),
    );
  });

  // 회귀: cashpobi(=cashwalk-biz 별칭) admin-cms 가이드를 호출하면 NudgeEAPCMS antd 패턴이 아니라
  //   DS(html) 경로로 우회돼야 한다. isDsAdminProject 가 별칭 정규화를 안 해서 project='cashpobi' 가 새어나가
  //   240px Sider / INFO / CMS MENU / 'Copyright Nudge EAP' 가 캐포비에 잘못 적용된 사고를 고친 케이스.
  for (const project of ["cashpobi", "cash-pobi", "cashwalkbiz", "cashwalk-biz"]) {
    it(`routes admin-cms guide to DS(html) path for project='${project}' (no NudgeEAPCMS antd)`, () => {
      const r = getGuide({ topic: "admin-cms", project }) as Record<string, unknown>;
      expect(r.intent).toBe("html");
      expect(r.project).toBe("cashwalk-biz");
      // NudgeEAPCMS antd 가이드 본문(Sider/footer/searchForm 등)이 새어나오면 안 된다
      expect(r.layout).toBeUndefined();
      expect(r.searchForm).toBeUndefined();
      expect((r.techStack as { forbidden?: string[] })?.forbidden).toContain("antd");
    });
  }

  // 영역 3분화: nudge-eap 은 어드민(b2b) 하드게이트 프로젝트 — intent:'admin' 일 때만 DS 우회.
  // topic 호출만으로는(사내 백오피스=NudgeEAPCMS 일 수 있음) antd 백오피스 가이드를 준다.
  for (const project of ["nudge-eap", "nudgeeap", "nudge", "eap"]) {
    it(`routes admin intent to DS(html) path for project='${project}' (b2b admin, no antd)`, () => {
      const r = getGuide({ topic: "backoffice", intent: "admin", project: project as never }) as Record<
        string,
        unknown
      >;
      expect(r.intent).toBe("html");
      expect(r.project).toBe("nudge-eap");
      expect(r.layout).toBeUndefined();
      expect(r.searchForm).toBeUndefined();
      expect((r.techStack as { forbidden?: string[] })?.forbidden).toContain("antd");
      // 캐포비 전용 패턴(page-pattern/sidebar)이 EAP 어드민으로 새면 안 된다
      expect(JSON.stringify(r.useInstead)).not.toContain("cashwalk-biz-page-patterns");
      expect(JSON.stringify(r.useInstead)).toContain("admin-shell");
    });
  }

  it("nudge-eap + topic backoffice (no admin intent) stays on the antd backoffice guide", () => {
    const r = getGuide({ topic: "backoffice", project: "nudge-eap" }) as Record<string, unknown>;
    expect(r.intent).toBe("backoffice");
    expect(r.layout).toBeTypeOf("object");
  });

  it("projectless backoffice guide is neutral (no hardcoded Nudge EAP footer) and surfaces the gate notice", () => {
    const r = getGuide({ topic: "backoffice" }) as Record<string, unknown>;
    expect(r.intent).toBe("backoffice");
    // 영역(어드민 하드게이트) 안내가 상단에 보여야 한다
    expect(r["⚠ 영역 확인 먼저"]).toBeTypeOf("string");
    expect(String(r["⚠ 영역 확인 먼저"])).toContain("캐포비");
    expect(String(r["⚠ 영역 확인 먼저"])).toContain("nudge-eap");
    // 중립화 — NudgeEAP 전용 푸터 카피가 박혀 있으면 안 되고 플레이스홀더가 나간다
    const footer = (r.layout as { footer?: { text?: string } })?.footer;
    expect(footer?.text).toBe("Copyright © <서비스명>. All Rights Reserved.");
    expect(r._note).toBeTypeOf("string");
  });

  it("injects serviceName into the backoffice footer copy", () => {
    const r = getGuide({ topic: "backoffice", serviceName: "Runmile" }) as Record<string, unknown>;
    const footer = (r.layout as { footer?: { text?: string } })?.footer;
    expect(footer?.text).toBe("Copyright © Runmile. All Rights Reserved.");
    expect(r.serviceName).toBe("Runmile");
  });

  it("keeps 'admin-cms' as a permanent alias of 'backoffice' with an _alias marker", () => {
    const alias = getGuide({ topic: "admin-cms" }) as Record<string, unknown>;
    const canonical = getGuide({ topic: "backoffice" }) as Record<string, unknown>;
    expect(alias._alias).toContain("backoffice");
    expect(alias.layout).toEqual(canonical.layout);
    expect(alias.searchForm).toEqual(canonical.searchForm);
  });

  it("flags an outside-gate project on the backoffice guide as b2b-admin-unsupported (advisory only)", () => {
    const r = getGuide({ topic: "backoffice", project: "trost" }) as Record<string, unknown>;
    expect(r.intent).toBe("backoffice");
    expect(String(r._advisory)).toContain("미지원");
  });
});

describe("getGuide aspects (selective principle loading)", () => {
  const aspectKeys = (r: Record<string, unknown>): string[] =>
    Object.keys(r).filter((k) => !k.startsWith("_") && k !== "intent" && k !== "scope");

  it("loads only the requested aspects of principles (radius→shapes alias)", () => {
    const full = getGuide({ topic: "principles" });
    const slim = getGuide({ topic: "principles", aspects: ["spacing", "radius", "typography"] });

    // radius is an alias for the 'shapes' key; color/elevation/etc. must be dropped.
    expect(aspectKeys(slim).sort()).toEqual(["shapes", "spacing", "typography"]);
    expect(slim.spacing).toEqual((full as Record<string, unknown>).spacing);
    expect(slim.colors).toBeUndefined();
    expect(slim.elevation).toBeUndefined();
  });

  it("resolves color→colors and tone→projectTone aliases", () => {
    const slim = getGuide({ topic: "principles", aspects: ["color", "tone"] });
    expect(aspectKeys(slim).sort()).toEqual(["colors", "projectTone"]);
  });

  it("expands dos-donts into dos + donts + bannedPatterns", () => {
    const slim = getGuide({ topic: "principles", aspects: ["dos-donts"] });
    expect(aspectKeys(slim).sort()).toEqual(["bannedPatterns", "donts", "dos"]);
  });

  it("merges aspects with explicit sections", () => {
    const slim = getGuide({ topic: "principles", aspects: ["radius"], sections: ["colors"] });
    expect(aspectKeys(slim).sort()).toEqual(["colors", "shapes"]);
  });

  it("still keeps meta keys and marks principles as called", () => {
    const slim = getGuide({ topic: "principles", aspects: ["spacing"] });
    expect(slim._advisory).toBeTypeOf("string");
    expect(principlesAcked()).toBe(true);
  });

  it("errors with validAspects when no aspect resolves", () => {
    const r = getGuide({ topic: "principles", aspects: ["nonsense"] });
    expect(r.error).toBeTypeOf("string");
    expect(r.validAspects).toEqual(expect.arrayContaining(["spacing", "radius", "typography"]));
  });

  it("proceeds with the known aspects when only some are unknown, surfacing _unknownAspects", () => {
    const slim = getGuide({ topic: "principles", aspects: ["spacing", "nonsense"] });
    expect(aspectKeys(slim)).toEqual(["spacing"]);
    expect(slim._unknownAspects).toEqual(["nonsense"]);
  });

  it("threads aspects through batched topics[]", () => {
    const result = getGuide({ topics: ["principles"], aspects: ["spacing"] });
    const principles = (result.topics as Record<string, Record<string, unknown>>).principles;
    expect(aspectKeys(principles)).toEqual(["spacing"]);
  });

  it("ignores aspects on non-principles topics (no error, full guide returned)", () => {
    const full = getGuide({ topic: "component:Button", target: "html" });
    const withAspects = getGuide({
      topic: "component:Button",
      target: "html",
      aspects: ["nonsense"],
    });
    expect(withAspects.error).toBeUndefined();
    expect(Object.keys(withAspects).sort()).toEqual(Object.keys(full).sort());
  });

  it("does not break sibling topics when batching principles with a component (no section leak)", () => {
    const result = getGuide({
      topics: ["principles", "component:Button"],
      aspects: ["spacing"],
      target: "html",
    });
    const topics = result.topics as Record<string, Record<string, unknown>>;
    expect(aspectKeys(topics.principles)).toEqual(["spacing"]); // principles sliced
    expect(topics["component:Button"].error).toBeUndefined(); // component intact
    expect(topics["component:Button"].name).toBe("Button");
  });
});

describe("getGuide view (response slimming)", () => {
  const size = (o: unknown) => JSON.stringify(o).length;

  it("view='examples' on a component returns only summary + examples (much smaller than full)", () => {
    const full = getGuide({ topic: "component:Button", target: "html" });
    const slim = getGuide({ topic: "component:Button", target: "html", view: "examples" });
    expect(slim.examples).toBeDefined();
    expect(slim.summary).toBeDefined();
    // metrics/matrixOverrides 류 큰 키는 빠진다
    expect(slim.pitfalls).toBeUndefined();
    expect(slim.metrics).toBeUndefined();
    expect(size(slim)).toBeLessThan(size(full) / 2);
  });

  it("view='rules' on a pattern returns rules + avoid (not examples/metrics)", () => {
    const slim = getGuide({ topic: "pattern:cashwalk-biz-form-layout", view: "rules" });
    expect(slim.rules).toBeDefined();
    expect(slim.avoid).toBeDefined();
    expect(slim.metrics).toBeUndefined();
  });

  it("view='examples' on a ready-made pattern keeps _readyMade (로고/계정/items 가 안 사라진다)", () => {
    // 회귀: ready-made <nds-sidebar> 가 rules[] 에만 있어 view:'examples'(=summary+examples)가
    //   통째로 드롭 → 에이전트가 손조립(로고/계정 누락). _readyMade 메타키로 항상 보존하도록 고침.
    const slim = getGuide({ topic: "pattern:cashwalk-biz-admin-sidebar", view: "examples" });
    const readyMade = (slim as { _readyMade?: { html?: string; shellHtml?: string } })._readyMade;
    expect(readyMade).toBeDefined();
    expect(readyMade?.html).toContain('<nds-sidebar project="cashwalk-biz"');
    expect(readyMade?.html).toContain('slot="account"');
    expect(readyMade?.html).toContain("충전 잔액");
    expect(readyMade?.html).toContain('slot="items"');
    // react ready-made 는 제거됨(공개 react Sidebar 삭제) — admin 사이드바는 목업 html 전용.
    expect(readyMade?.shellHtml).toContain('class="nds-shell"');
    // verbose rules 는 view:'examples' 라 빠진다(슬림 유지) — ready-made 만 메타로 살아남음
    expect(slim.rules).toBeUndefined();
  });

  it("single oversized topic (no slice) elides large sections and keeps summary (2-②a)", () => {
    // 회귀: 단일 topic 은 기본 full 이라 pattern:cashwalk-biz-admin-sidebar(_readyMade ~30KB)를
    //   통째로 컨텍스트에 쏟았다. 슬라이스 미지정 + 본문 >15KB 면 큰 섹션을 생략(크기만)한다.
    const topic = "pattern:cashwalk-biz-admin-sidebar";
    const full = getGuide({ topic, view: "full" });
    const def = getGuide({ topic });

    expect(def._oversized).toBeDefined();
    expect(size(def)).toBeLessThan(size(full) / 3); // 대폭 축소
    expect(def.summary).toBeDefined(); // summary 는 보존
    // 큰 _readyMade 본문은 빠지고 _oversized.elidedSections 에 크기로만 기록
    expect(def._readyMade).toBeUndefined();
    const elided = (def._oversized as { elidedSections?: Record<string, number> }).elidedSections;
    expect(elided?._readyMade).toBeGreaterThan(15_000); // ready-made 트리 본문이 크기로만 기록됨
  });

  it("view='full' bypasses the oversize guard (전체 본문 유지)", () => {
    const full = getGuide({ topic: "pattern:cashwalk-biz-admin-sidebar", view: "full" });
    expect(full._oversized).toBeUndefined();
    expect((full as { _readyMade?: unknown })._readyMade).toBeDefined();
  });

  it("small single topic is not affected by the oversize guard", () => {
    const r = getGuide({ topic: "component:Button", target: "html" });
    expect(r._oversized).toBeUndefined();
  });

  it("explicit sections override view", () => {
    const slim = getGuide({
      topic: "component:Button",
      target: "html",
      view: "examples",
      sections: ["pitfalls"],
    });
    expect(slim.pitfalls).toBeDefined();
    expect(slim.examples).toBeUndefined(); // view 무시되고 sections 가 이김
  });

  it("view threads through batched topics[] and shrinks the whole batch", () => {
    const topics = ["component:Button", "component:Input", "pattern:cashwalk-biz-form-layout"];
    const full = getGuide({ topics, target: "html", view: "full" });
    const slim = getGuide({ topics, target: "html", view: "examples" });
    expect(size(slim)).toBeLessThan(size(full) / 2);
    const button = (slim.topics as Record<string, Record<string, unknown>>)["component:Button"];
    expect(button.examples).toBeDefined();
    expect(button.metrics).toBeUndefined();
  });

  it("batched topics default to a slim view unless view='full' is explicit", () => {
    const topics = ["component:Button", "component:Input", "pattern:cashwalk-biz-form-layout"];
    const slimDefault = getGuide({ topics, target: "html" });
    const full = getGuide({ topics, target: "html", view: "full" });

    expect(size(slimDefault)).toBeLessThan(size(full) / 2);
    const button = (slimDefault.topics as Record<string, Record<string, unknown>>)[
      "component:Button"
    ];
    expect(button.examples).toBeDefined();
    expect(button.colorMatrix).toBeUndefined();
  });

  it("batch dedups identical boilerplate (_principlesDigest) into _shared", () => {
    const result = getGuide({
      topics: ["component:Button", "component:Input"],
      target: "html",
    });
    const shared = result._shared as Record<string, unknown> | undefined;
    expect(shared?._principlesDigest).toBeDefined();
    const button = (result.topics as Record<string, Record<string, unknown>>)["component:Button"];
    expect(button._principlesDigest).toBeUndefined(); // child 에서 제거됨(중복 제거)
  });

  it("hoists _advisory into _shared even for mixed figma-ref components", () => {
    // Button=figma 연결됨 / Chip=figma 미연결. 통일 전엔 advisory 가 달라 hoist 안 됐다.
    const result = getGuide({ topics: ["component:Button", "component:Chip"] });
    const shared = result._shared as Record<string, unknown> | undefined;
    expect(shared?._advisory).toBeTypeOf("string");
    const topics = result.topics as Record<string, Record<string, unknown>>;
    expect(topics["component:Button"]._advisory).toBeUndefined(); // child 에서 제거됨
    expect(topics["component:Chip"]._advisory).toBeUndefined();
  });
});

describe("getGuide principles — learned principles promotion", () => {
  let dir: string;
  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "learned-principles-"));
  });
  afterEach(() => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      /* noop */
    }
  });

  const mk = (intent: string, decision: string, project = "trost"): DesignDecisionRow => ({
    ts: `t-${intent}`,
    ok: true,
    screen: { project, surface: "web", intent },
    decisions: [decision],
    rationales: [],
    componentsUsed: [],
    tokensUsed: [],
    hash: intent,
  });
  const seed = (rows: DesignDecisionRow[]): void => {
    fs.writeFileSync(
      path.join(dir, DESIGN_DECISIONS_FILE),
      rows.map((r) => JSON.stringify(r)).join("\n") + "\n",
      "utf-8",
    );
  };

  const decision = "CTA 는 항상 projectSolid";
  const threeScreens = (project = "trost"): DesignDecisionRow[] => [
    mk("login", decision, project),
    mk("signup", decision, project),
    mk("home", decision, project),
  ];

  it("merges _learnedPrinciples into the principles response when a decision recurs >= threshold", () => {
    seed(threeScreens());
    const r = getGuide({ topic: "principles", project: "trost", cwd: dir });
    const learned = r._learnedPrinciples as Record<string, unknown> | undefined;
    expect(learned).toBeTypeOf("object");
    expect(learned!.project).toBe("trost");
    const principles = learned!.principles as Array<{ text: string; count: number }>;
    expect(principles[0]).toMatchObject({ text: decision, count: 3 });
  });

  it("omits _learnedPrinciples below threshold (only 2 screens, default threshold 3)", () => {
    seed([mk("login", decision), mk("signup", decision)]);
    const r = getGuide({ topic: "principles", project: "trost", cwd: dir });
    expect(r._learnedPrinciples).toBeUndefined();
  });

  it("omits _learnedPrinciples when there is no decision log (no crash)", () => {
    const r = getGuide({ topic: "principles", project: "trost", cwd: dir });
    expect(r._learnedPrinciples).toBeUndefined();
    expect(r._advisory).toBeTypeOf("string"); // 정상 principles 응답은 그대로
  });

  it("survives aspect/section slicing (marker attached after pickSections)", () => {
    seed(threeScreens());
    const r = getGuide({ topic: "principles", project: "trost", cwd: dir, aspects: ["spacing"] });
    expect(Object.keys(r)).toContain("spacing");
    expect(r._learnedPrinciples).toBeTypeOf("object");
  });

  it("infers project from the nudge.project marker when project arg is omitted", () => {
    seed(threeScreens());
    fs.writeFileSync(path.join(dir, "nudge.project"), "trost\n", "utf-8");
    const r = getGuide({ topic: "principles", cwd: dir });
    const learned = r._learnedPrinciples as Record<string, unknown> | undefined;
    expect(learned?.project).toBe("trost");
  });

  it("respects NUDGE_LEARNED_PRINCIPLES=0 opt-out", () => {
    seed(threeScreens());
    const prev = process.env.NUDGE_LEARNED_PRINCIPLES;
    try {
      process.env.NUDGE_LEARNED_PRINCIPLES = "0";
      const r = getGuide({ topic: "principles", project: "trost", cwd: dir });
      expect(r._learnedPrinciples).toBeUndefined();
    } finally {
      if (prev === undefined) delete process.env.NUDGE_LEARNED_PRINCIPLES;
      else process.env.NUDGE_LEARNED_PRINCIPLES = prev;
    }
  });
});

describe("resolveIntentRouting — 영역 3분화 매트릭스", () => {
  it("일반 발화/무발화는 html", () => {
    expect(resolveIntentRouting(undefined, undefined).kind).toBe("html");
    expect(resolveIntentRouting("트로스트 마이페이지 목업").kind).toBe("html");
  });

  it("운영자 키워드 자유발화는 프로젝트 유무와 무관하게 확답 요구 (캐포비 제외)", () => {
    for (const utterance of [
      "어드민 화면",
      "백오피스 만들어줘",
      "CMS 목록",
      "운영툴",
      "admin page",
    ]) {
      expect(resolveIntentRouting(utterance).kind).toBe("ambiguous-operator");
    }
    expect(resolveIntentRouting("어드민 화면", "trost").kind).toBe("ambiguous-operator");
    expect(resolveIntentRouting("EAP 어드민", "nudge-eap").kind).toBe("ambiguous-operator");
  });

  it("캐포비는 자체 admin DS 보유 — 운영자/백오피스/어드민 어느 발화든 질문 없이 DS(html)", () => {
    for (const intent of ["캐포비 CMS", "admin", "backoffice", "admin-cms", "어드민 온보딩"]) {
      const r = resolveIntentRouting(intent, "cashpobi");
      expect(r.kind).toBe("html");
      expect(r.kind === "html" && r.surface).toBe("admin");
      expect(r.kind === "html" && r.project).toBe("cashwalk-biz");
    }
  });

  it("intent:'admin' 하드게이트 — 게이트 프로젝트는 html, 밖은 차단, 미지정은 질문", () => {
    const eap = resolveIntentRouting("admin", "eap");
    expect(eap.kind).toBe("html");
    expect(eap.kind === "html" && eap.surface).toBe("admin");
    expect(eap.kind === "html" && eap.project).toBe("nudge-eap");

    const blocked = resolveIntentRouting("admin", "trost");
    expect(blocked.kind).toBe("blocked-admin");
    expect(blocked.kind === "blocked-admin" && blocked.requestedProject).toBe("trost");
    expect(
      blocked.kind === "blocked-admin" && blocked.supportedAdminProjects.includes("nudge-eap"),
    ).toBe(true);

    expect(resolveIntentRouting("admin", undefined).kind).toBe("ambiguous-operator");
  });

  it("미지(unknown) 프로젝트 + intent:'admin' 은 차단 (지원 확인 불가)", () => {
    const r = resolveIntentRouting("admin", "some-unknown-project");
    expect(r.kind).toBe("blocked-admin");
  });

  it("intent:'backoffice' / 레거시 'admin-cms' 는 backoffice (질문/차단 없음)", () => {
    expect(resolveIntentRouting("backoffice").kind).toBe("backoffice");
    expect(resolveIntentRouting("backoffice", "trost").kind).toBe("backoffice");
    expect(resolveIntentRouting("backoffice", "nudge-eap").kind).toBe("backoffice");
    expect(resolveIntentRouting("admin-cms").kind).toBe("backoffice");
    expect(resolveIntentRouting("admin-cms", "runmile").kind).toBe("backoffice");
  });

  it("deprecated resolveEffectiveIntent 는 html 외 전부를 admin-cms 로 뭉갠다 (구 dist 호환)", () => {
    expect(resolveEffectiveIntent("backoffice")).toBe("admin-cms");
    expect(resolveEffectiveIntent("어드민")).toBe("admin-cms");
    expect(resolveEffectiveIntent("admin", "cashpobi")).toBe("html");
    expect(resolveEffectiveIntent("마이페이지")).toBe("html");
  });
});
