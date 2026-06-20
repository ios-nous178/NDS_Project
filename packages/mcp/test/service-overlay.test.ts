import { describe, expect, it } from "vitest";
import { getGuide } from "../src/tools/guides.js";
import { mergeServiceOverlay } from "../src/guides/merge.js";

describe("service overlay merge — Button", () => {
  it("geniet: allowedVariants 가 base 를 좁히고, disallowed/preferred 가 concat-dedupe", () => {
    const result = getGuide({ topic: "component:Button", project: "geniet", target: "html" });

    // 머지 시그널
    expect(result._projectApplied).toBe("geniet");

    // allowedVariants: service 가 전체 교체 (좁히기)
    expect(result.allowedVariants).toEqual(["solid", "outlined"]);

    // disallowedVariants: concat-dedupe (base 가 없거나 비어도 overlay 가 추가)
    expect(result.disallowedVariants).toEqual(expect.arrayContaining(["soft"]));

    // preferredPatterns: concat-dedupe — Geniet 시그니처 라인 포함
    const preferred = (result.preferredPatterns as string[] | undefined) ?? [];
    expect(preferred.some((p) => p.includes("dark inverse") && p.includes("Geniet"))).toBe(true);
  });

  it("cashpobi: servicePitfalls 가 base.pitfalls 와 별개 array 로 노출", () => {
    const result = getGuide({ topic: "component:Button", project: "cashwalk-biz", target: "html" });

    expect(result._projectApplied).toBe("cashwalk-biz");

    // base.pitfalls 는 그대로 살아 있어야 함
    expect(Array.isArray(result.pitfalls)).toBe(true);
    expect((result.pitfalls as string[]).length).toBeGreaterThan(0);

    // servicePitfalls 는 별개로 존재 — Cashpobi Neutral=Secondary 네이밍 함정
    expect(Array.isArray(result.servicePitfalls)).toBe(true);
    const sp = result.servicePitfalls as string[];
    expect(sp.some((s) => s.includes("Neutral") && s.includes("Secondary"))).toBe(true);

    // preferredPatterns: 5조합 라인 포함
    const preferred = (result.preferredPatterns as string[] | undefined) ?? [];
    expect(preferred.some((p) => p.includes("5조합"))).toBe(true);
  });

  it("trost: overlay 가 없으면 _projectOverlayEmpty 마커 + base 그대로", () => {
    const result = getGuide({ topic: "component:Button", project: "trost", target: "html" });

    expect(result._projectApplied).toBe("trost");
    expect(result._projectOverlayEmpty).toBe(true);

    // base.pitfalls 등은 그대로
    expect(Array.isArray(result.pitfalls)).toBe(true);
  });

  it("project 미지정: _projectVariants 슬림 요약 첨부 (geniet/cashpobi 양쪽)", () => {
    const result = getGuide({ topic: "component:Button", target: "html" });

    expect(result._projectApplied).toBeUndefined();
    const variants = result._projectVariants as Record<string, string[]> | undefined;
    expect(variants).toBeDefined();
    expect(variants!.geniet).toEqual(
      expect.arrayContaining(["allowedVariants", "disallowedVariants", "preferredPatterns"]),
    );
    expect(variants!["cashwalk-biz"]).toEqual(
      expect.arrayContaining(["preferredPatterns", "servicePitfalls"]),
    );
  });
});

describe("service overlay merge — UX writing (nudge-eap)", () => {
  it("nudge-eap: copyTone 에 voiceToneAddendum + eapDomain 6개", () => {
    const result = getGuide({ topic: "ux-writing", project: "nudge-eap" });

    expect(result._projectApplied).toBe("nudge-eap");

    const copyTone = result.copyTone as
      | { voiceToneAddendum?: string; eapDomain?: string[] }
      | undefined;
    expect(copyTone).toBeDefined();
    expect(copyTone!.voiceToneAddendum).toContain("NudgeEAP");
    expect(copyTone!.eapDomain).toHaveLength(6);
    expect(copyTone!.eapDomain![0]).toContain("위기");
  });

  it("trost: ux-writing overlay 없음 → _projectOverlayEmpty", () => {
    const result = getGuide({ topic: "ux-writing", project: "trost" });
    expect(result._projectOverlayEmpty).toBe(true);
    expect((result as { copyTone?: unknown }).copyTone).toBeUndefined();
  });

  it("project 미지정: ux-writing 의 _projectVariants 가 nudge-eap 만 노출", () => {
    const result = getGuide({ topic: "ux-writing" });
    const variants = result._projectVariants as Record<string, string[]> | undefined;
    expect(variants).toBeDefined();
    expect(variants!["nudge-eap"]).toContain("copyTone");
    expect(variants!.geniet).toBeUndefined();
  });
});

describe("service overlay merge — Modal (overlay + matrixOverrides 동시 적용)", () => {
  it("cashwalk-biz: service overlay + matrixOverrides dimensions 둘 다 응답에", () => {
    const result = getGuide({ topic: "component:Modal", project: "cashwalk-biz", target: "html" });

    // service overlay (preferredPatterns / servicePitfalls / forbiddenPatterns)
    expect(result._projectApplied).toBe("cashwalk-biz");
    const preferred = (result.preferredPatterns as string[] | undefined) ?? [];
    expect(preferred.some((p) => p.includes("검정 CTA"))).toBe(true);
    const sp = (result.servicePitfalls as string[] | undefined) ?? [];
    expect(sp.some((s) => s.includes("data-project"))).toBe(true);
    const fp = (result.forbiddenPatterns as string[] | undefined) ?? [];
    expect(fp.some((p) => p.includes("closable") && p.includes("onClose"))).toBe(true);

    // matrixOverrides (base 안 metadata) → dimensions 응답에 노출
    expect(result._matrixOverrideApplied).toBe("cashwalk-biz");
    const dims = result.dimensions as Record<string, string> | undefined;
    expect(dims).toBeDefined();
    expect(dims!.width).toContain("480");
    expect(dims!.radius).toContain("16");
    expect(dims!.padding).toContain("32");

    // raw matrixOverrides map 은 응답에서 제거
    expect(result.matrixOverrides).toBeUndefined();
  });

  it("trost: Modal overlay/matrixOverrides 둘 다 없음 → _projectOverlayEmpty", () => {
    const result = getGuide({ topic: "component:Modal", project: "trost", target: "html" });
    expect(result._projectOverlayEmpty).toBe(true);
    expect(result._matrixOverrideApplied).toBeUndefined();
    expect(result.dimensions).toBeUndefined();
    expect(result.matrixOverrides).toBeUndefined();
  });

  it("project 미지정: raw matrixOverrides 제거 + _matrixOverrideProjects 슬림 요약", () => {
    const result = getGuide({ topic: "component:Modal", target: "html" });
    expect(result.matrixOverrides).toBeUndefined();
    const projects = result._matrixOverrideProjects as string[] | undefined;
    expect(projects).toEqual(["cashwalk-biz"]);
    // service overlay 슬림 요약은 그대로
    const variants = result._projectVariants as Record<string, string[]> | undefined;
    expect(variants!["cashwalk-biz"]).toContain("forbiddenPatterns");
  });

  it("Button cashwalk-biz: matrixOverrides — sizeMatrix sm/xs 부분 override + stateMatrix 깨끗 교체 + dimensions", () => {
    const result = getGuide({ topic: "component:Button", project: "cashwalk-biz", target: "html" });
    expect(result._projectApplied).toBe("cashwalk-biz");
    expect(result._matrixOverrideApplied).toBe("cashwalk-biz");

    // sizeMatrix: base xl/lg/md 는 그대로, sm/xs 는 cashwalk-biz override
    const size = result.sizeMatrix as Record<string, string>;
    expect(size.xl).toContain("52"); // base 보존
    expect(size.lg).toContain("48"); // base 보존
    expect(size.md).toContain("44"); // base 보존
    expect(size.sm).toContain("40"); // override
    expect(size.xs).toContain("36"); // override

    // stateMatrix: cashwalk-biz disabled 3종이 base 의 "(NudgeEAP) ... (캐시워크 포 비즈니스) ..." 텍스트를 깨끗하게 덮어씀
    const state = result.stateMatrix as Record<string, string>;
    expect(state["primary/solid/disabled"]).toBe(
      "bg #DDDDDD (atomic Neutral/400) + text #FFFFFF (Figma 3098:1079).",
    );
    expect(state["primary/solid/disabled"]).not.toContain("NudgeEAP"); // base 텍스트 사라짐
    expect(state.hover).toContain("primary=var(--semantic-fill-brand-hover)"); // base 의 다른 키는 보존

    // dimensions
    const dims = result.dimensions as Record<string, string>;
    expect(dims.shape).toContain("default(radius 8");
    expect(dims.shape).toContain("pill(radius full");
    expect(dims.relatedComponents).toContain("TextButton");
  });

  it("Button trost: matrixOverrides 없음 → sizeMatrix/stateMatrix 는 base 그대로", () => {
    const result = getGuide({ topic: "component:Button", project: "trost", target: "html" });
    expect(result._matrixOverrideApplied).toBeUndefined();
    expect(result.dimensions).toBeUndefined();
    const size = result.sizeMatrix as Record<string, string>;
    expect(size.sm).toContain("42"); // base 값 그대로 (override 안 됨)
  });

  it("Button base.stateMatrix 노이즈 제거 — '(NudgeEAP)' / '(캐시워크 포 비즈니스)' 라벨 사라짐", () => {
    const result = getGuide({ topic: "component:Button", target: "html" });
    const state = result.stateMatrix as Record<string, string>;
    expect(state["primary/solid/disabled"]).not.toContain("NudgeEAP");
    expect(state["primary/solid/disabled"]).not.toContain("캐시워크 포 비즈니스");
    expect(state["primary/solid/disabled"]).toContain("#9CA2AE"); // base default NudgeEAP/Trost/Geniet 공통 토큰 값은 유지
  });
});

describe("Project-aware Base metadata — ProjectHeader / ProjectFooter", () => {
  it("ProjectHeader trost: validPropValues + assetManifest 가 trost 값만 fold", () => {
    const result = getGuide({ topic: "component:ProjectHeader", project: "trost", target: "html" });
    expect(result._projectAwareApplied).toBe("trost");

    const vpv = result.validPropValues as Record<string, string[]>;
    expect(vpv.activeKey).toEqual(["home", "counsel", "test", "care", "center"]);

    const am = result.assetManifest as string[];
    expect(am).toEqual(["trost-logo.svg"]);

    // raw map 은 응답에서 제거
    expect((result.validPropValues as Record<string, string[]>).geniet).toBeUndefined();
  });

  it("ProjectHeader geniet: 자기 project 값만, trost 값은 안 보임", () => {
    const result = getGuide({ topic: "component:ProjectHeader", project: "geniet", target: "html" });
    const vpv = result.validPropValues as Record<string, string[]>;
    expect(vpv.activeKey).toEqual(["home", "community", "deal", "review"]);
    const am = result.assetManifest as string[];
    expect(am).toEqual(["geniet-logo-pc.webp", "geniet-logo-footer.webp"]);
  });

  it("ProjectFooter trost: forcedProps.footerTone = 'dark' (명시 project)", () => {
    const result = getGuide({ topic: "component:ProjectFooter", project: "trost", target: "html" });
    const fp = result.forcedProps as Record<string, string>;
    expect(fp.footerTone).toBe("dark");
  });

  it("ProjectFooter geniet: forcedProps.footerTone = 'light' ('*' default fallback)", () => {
    const result = getGuide({ topic: "component:ProjectFooter", project: "geniet", target: "html" });
    const fp = result.forcedProps as Record<string, string>;
    expect(fp.footerTone).toBe("light"); // '*' default 적용
  });

  it("Sidebar cashwalk-biz: iconSet.gnb 9종이 응답에 노출", () => {
    const result = getGuide({ topic: "component:Sidebar", project: "cashwalk-biz", target: "html" });
    expect(result._projectApplied).toBe("cashwalk-biz");
    const iconSet = result.iconSet as Record<string, string[]>;
    expect(iconSet.gnb).toHaveLength(9);
    expect(iconSet.gnb).toContain("CashwalkBizGnbBannerIcon");
    expect(iconSet.gnb).toContain("CashwalkBizGnbSettingIcon");
  });

  it("Sidebar trost: overlay 없음 → _projectOverlayEmpty, iconSet 없음", () => {
    const result = getGuide({ topic: "component:Sidebar", project: "trost", target: "html" });
    expect(result._projectOverlayEmpty).toBe(true);
    expect(result.iconSet).toBeUndefined();
  });

  it("ProjectHeader project 미지정: raw map 유지 + _projectAwareMetadataProjects 슬림 요약", () => {
    const result = getGuide({ topic: "component:ProjectHeader", target: "html" });
    expect(result._projectAwareApplied).toBeUndefined();
    const projects = result._projectAwareMetadataProjects as string[];
    expect(projects).toEqual(["cashwalk-biz", "geniet", "nudge-eap", "trost"]);

    // raw map 그대로 노출 (project-aware metadata 는 base 의 일부)
    const vpv = result.validPropValues as Record<string, Record<string, string[]>>;
    expect(vpv.trost.activeKey).toEqual(["home", "counsel", "test", "care", "center"]);
  });
});

describe("mergeServiceOverlay — 머지 시맨틱 단위 검증", () => {
  it("allowedVariants 는 overlay 가 전체 교체 (좁히기)", () => {
    const merged = mergeServiceOverlay(
      { allowedVariants: ["solid", "outlined", "soft"] },
      { allowedVariants: ["solid", "outlined"] },
    );
    expect(merged.allowedVariants).toEqual(["solid", "outlined"]);
  });

  it("disallowedVariants / preferred / forbiddenPatterns 는 concat-dedupe (순서 유지)", () => {
    const merged = mergeServiceOverlay(
      { preferredPatterns: ["A", "B"], forbiddenPatterns: ["X"] },
      { preferredPatterns: ["B", "C"], forbiddenPatterns: ["Y"] },
    );
    expect(merged.preferredPatterns).toEqual(["A", "B", "C"]); // B 중복 제거
    expect(merged.forbiddenPatterns).toEqual(["X", "Y"]);
  });

  it("iconSet 는 shallow merge by key (overlay 가 같은 키 덮어쓰기)", () => {
    const merged = mergeServiceOverlay(
      { iconSet: { gnb: ["HomeIcon"], cta: ["ArrowIcon"] } },
      { iconSet: { gnb: ["CashpobiGnbHome"], extra: ["Foo"] } },
    );
    expect(merged.iconSet).toEqual({
      gnb: ["CashpobiGnbHome"], // overlay 가 덮어씀
      cta: ["ArrowIcon"], // base 보존
      extra: ["Foo"], // overlay 신규
    });
  });

  it("overlay 없으면 base 그대로 반환", () => {
    const base = { foo: "bar", pitfalls: ["a"] };
    expect(mergeServiceOverlay(base, undefined)).toBe(base);
  });
});
