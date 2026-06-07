// 자동 생성기 — packages/icons/svg/mono/cashwalk-biz-gnb-*.svg 를 인라인해
// src/guides/cashwalk-biz-sidebar-example.ts 를 만든다. 메뉴/아이콘이 바뀌면 이 스크립트를 다시 돌릴 것.
// 실행: node packages/mcp/scripts/gen-cashwalk-biz-sidebar-example.mjs (cwd 무관 — 스크립트 위치 기준 경로)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
const here = path.dirname(fileURLToPath(import.meta.url)); // packages/mcp/scripts
const repoRoot = path.resolve(here, "../../..");
const dir = path.join(repoRoot, "packages/icons/svg/mono");
const OUT = path.join(repoRoot, "packages/mcp/src/guides/cashwalk-biz-sidebar-example.ts");
const compact = (s) => s.replace(/\n\s*/g, "").trim();
const svg = (slug) => compact(fs.readFileSync(`${dir}/cashwalk-biz-gnb-${slug}.svg`, "utf-8"));
const iconComp = (slug) =>
  "CashwalkBizGnb" +
  slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("") +
  "Icon";
const sections = [
  {
    key: "ad",
    label: "광고 관리",
    items: [
      {
        key: "banner",
        label: "배너",
        icon: "banner",
        children: [
          { key: "banner-new", label: "배너 등록" },
          { key: "banner-list", label: "배너 목록" },
          { key: "banner-report", label: "배너 리포트" },
        ],
      },
      { key: "channel", label: "채널", icon: "channel" },
      { key: "quiz", label: "퀴즈", icon: "quiz" },
      { key: "message", label: "메시지", icon: "chat" },
    ],
  },
  {
    key: "asset",
    label: "자산 관리",
    items: [
      { key: "cash", label: "캐시 충전", icon: "cash" },
      { key: "catalog", label: "상품 카탈로그", icon: "catalog" },
    ],
  },
  {
    key: "account",
    label: "계정 관리",
    items: [
      { key: "member", label: "회원", icon: "member" },
      { key: "content", label: "콘텐츠 편집", icon: "edit" },
      { key: "setting", label: "설정", icon: "setting" },
    ],
  },
];
const htmlItems = sections.map((sec) => ({
  key: sec.key,
  label: sec.label,
  items: sec.items.map((it) => ({
    key: it.key,
    label: it.label,
    icon: svg(it.icon),
    ...(it.children ? { children: it.children } : {}),
  })),
}));
const htmlJson = JSON.stringify(htmlItems);
if (htmlJson.includes("`") || htmlJson.includes("${")) throw new Error("template collision");

// 깔끔 구조(아이콘=컴포넌트명) — 레퍼런스용
const structure = sections.map((sec) => ({
  key: sec.key,
  label: sec.label,
  items: sec.items.map((it) => ({
    key: it.key,
    label: it.label,
    icon: iconComp(it.icon),
    ...(it.children ? { children: it.children.map((c) => ({ key: c.key, label: c.label })) } : {}),
  })),
}));
const imports = [...new Set(sections.flatMap((s) => s.items.map((i) => iconComp(i.icon))))];

// React items pretty (icon as JSX, not string)
const reactItems = JSON.stringify(
  structure.map((s) => ({ ...s, items: s.items.map((i) => ({ ...i, icon: `@@${i.icon}@@` })) })),
  null,
  2,
).replace(/"@@([A-Za-z]+)@@"/g, "<$1 />");

// 브랜드 로고 = data URI (BrandHeader 와 동일 SSOT). 상대경로는 단일 HTML 에서 깨지므로 HTML 예시엔 인라인.
const logoSrc = path.join(repoRoot, "packages/assets/src/brand-logo-defaults.ts");
const logoMatch = fs
  .readFileSync(logoSrc, "utf-8")
  .match(/CASHWALK_BIZ_LOGO_DATA_URI\s*=\s*["'`](data:[^"'`]*)["'`]/);
if (!logoMatch) throw new Error("CASHWALK_BIZ_LOGO_DATA_URI 를 assets 소스에서 못 찾음");
const logoUri = logoMatch[1];
if (logoUri.includes("`") || logoUri.includes("${")) throw new Error("logo uri template collision");

const htmlMarkup = `<nds-sidebar active-key="banner-list" width="300"
  logo-src="LOGO_URI_HERE" logo-alt="Cashwalk for Business" title="포 비즈니스"
  items='ITEMS_JSON_HERE'></nds-sidebar>`;

const file = `/**
 * 캐시워크 포 비즈니스(cashwalk-biz) 어드민 **사이드바 ready-made 픽업** — pattern:cashwalk-biz-admin-sidebar SSOT.
 *
 * 자동 생성물(scripts 로 ../../icons/svg/mono/cashwalk-biz-gnb-*.svg 를 인라인). 손으로 수정하지 말고
 * 메뉴/아이콘이 바뀌면 생성 스크립트를 다시 돌릴 것. (라벨/구조는 오버레이 기반 best-effort — Figma 3304:617 미검증 자리표시.)
 *
 * - HTML: <nds-sidebar items='...'> 의 item.icon = inline SVG 문자열(이름 아님). 아래 ITEMS 는 SVG 가 이미 인라인돼 있고
 *   로고도 data URI(base64)로 인라인돼 있어 find_icon 반복·자산 호스팅 없이 그대로 복붙 → 단일 HTML 에서도 안 깨짐.
 * - React: <Sidebar items={...}> 의 icon = ReactNode → CashwalkBizGnb* 아이콘 컴포넌트 엘리먼트. 로고는 앱이 자산을
 *   번들하므로 public 경로로 충분(단일 파일 문제 없음). 인라인이 필요하면 CASHWALK_BIZ_ADMIN_SIDEBAR_LOGO_DATA_URI 사용.
 */

/** 메뉴 구조(아이콘=컴포넌트명) — 사람이 읽는 레퍼런스. 실제 픽업은 아래 HTML/React 예시 사용. */
export const CASHWALK_BIZ_ADMIN_SIDEBAR_SECTIONS = ${JSON.stringify(structure, null, 2)} as const;

/** React <Sidebar> 에 import 해야 하는 GNB 아이콘 컴포넌트들. */
export const CASHWALK_BIZ_ADMIN_SIDEBAR_ICON_IMPORTS = ${JSON.stringify(imports)} as const;

/** 캐포비 브랜드 로고 data URI (BrandHeader 와 동일 SSOT). 단일 HTML 에서 안 깨지게 인라인용. */
export const CASHWALK_BIZ_ADMIN_SIDEBAR_LOGO_DATA_URI = String.raw\`${logoUri}\`;

/** HTML <nds-sidebar items='...'> 에 그대로 넣는 JSON (SVG 인라인·이스케이프 완료). String.raw 로 백슬래시 보존. */
export const CASHWALK_BIZ_ADMIN_SIDEBAR_HTML_ITEMS = String.raw\`${htmlJson}\`;

/** 복붙용 HTML 마크업 — 로고 data URI + items SVG 인라인 완료(단일 HTML 안전). */
export const CASHWALK_BIZ_ADMIN_SIDEBAR_HTML =
  ${JSON.stringify(htmlMarkup.split("LOGO_URI_HERE")[0])} +
  CASHWALK_BIZ_ADMIN_SIDEBAR_LOGO_DATA_URI +
  ${JSON.stringify(htmlMarkup.split("LOGO_URI_HERE")[1].split("ITEMS_JSON_HERE")[0])} +
  CASHWALK_BIZ_ADMIN_SIDEBAR_HTML_ITEMS +
  ${JSON.stringify(htmlMarkup.split("ITEMS_JSON_HERE")[1])};

/** 복붙용 React 예시 (아이콘 컴포넌트 import 후). 로고는 public 경로 — 인라인 필요시 위 LOGO_DATA_URI. */
export const CASHWALK_BIZ_ADMIN_SIDEBAR_REACT = String.raw\`import { ${imports.join(", ")} } from "@nudge-design/icons";
import { Sidebar } from "@nudge-design/react";

const items = ${reactItems};

<Sidebar items={items} activeKey="banner-list" width={300}
  logo={{ src: "/brand-logos/cashwalk-biz.svg", alt: "Cashwalk for Business" }}
  onItemClick={(it) => navigate(it.key)} />\`;
`;
// prettier 로 포맷해 lint-staged/CI 와 동일한 결과 보장(재생성 = 결정적, 포맷 드리프트 없음).
const cfg = (await prettier.resolveConfig(OUT)) ?? {};
const formatted = await prettier.format(file, { ...cfg, parser: "typescript" });
fs.writeFileSync(OUT, formatted);
console.log("written", path.relative(repoRoot, OUT), "(", formatted.length, "bytes )");
