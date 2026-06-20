import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Icon catalog SSOT builder.
 *
 * @nudge-design/icons barrel(packages/icons/src/index.ts) 를 단 한 번 반영해
 * metadata/iconCatalog.json 을 생성한다. 이 파일이 "어떤 아이콘이 존재하고, 각 아이콘의
 * 프로젝트(prefix)·kebab 이름이 무엇인가" + "CashwalkBiz 큐레이션 카탈로그(카테고리·source)" 의
 * 단일 출처다. docs IconCatalog 와 storybook Icons*.stories 가 모두 이 JSON 을 소비한다.
 *
 * 이전에는 docs projectOf(3프로젝트만), storybook projectOf(5), 그리고 CashwalkBiz 46행 ICON_MAP 이
 * 각각 손으로 복제돼 docs 가 CashwalkBiz/Runmile/Mockup 을 "Common" 으로 흘리는 버그가 있었다.
 *
 * 출력은 결정적(타임스탬프 없음) → `--check` 는 순수 콘텐츠 비교. check-ssot 게이트가 stale 차단.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const iconsIndexPath = path.join(rootDir, "packages", "icons", "src", "index.ts");
const outputPath = path.join(rootDir, "metadata", "iconCatalog.json");
const checkMode = process.argv.includes("--check");

export const PROJECTS = [
  { id: "nudge-eap", label: "NudgeEAP" },
  { id: "geniet", label: "Geniet" },
  { id: "trost", label: "Trost" },
  { id: "cashwalk-biz", label: "CashwalkBiz" },
  { id: "runmile", label: "Runmile" },
  { id: "mockup", label: "Mockup" },
];

/** export 이름 prefix → 프로젝트. (storybook projectOf 를 SSOT 로 흡수 + Runmile 누락 버그 교정) */
export function projectOf(name) {
  if (name.startsWith("CashwalkBiz")) return "cashwalk-biz";
  if (name.startsWith("Geniet")) return "geniet";
  if (name.startsWith("Trost")) return "trost";
  if (name.startsWith("Runmile")) return "runmile";
  if (name.startsWith("Mockup") || name.startsWith("IconSax")) return "mockup";
  return "nudge-eap";
}

/** PascalCase 컴포넌트명 → kebab 파일명(.svg). docs IconCatalog.pascalToKebab 와 동일. */
export function pascalToKebab(name) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

/**
 * CashwalkBiz 큐레이션 카탈로그 — 이전 Icons.CashwalkBiz.stories.tsx 의 ICON_MAP(46행) 을
 * 이곳으로 이관. display 순서(카테고리 그룹)를 그대로 보존한다. name = export 컴포넌트명.
 */
const CASHWALK_BIZ_CATALOG = [
  // Navigation (7) — chevron 4 + arrow 3
  { name: "ChevronUpIcon", displayName: "chevron-up", category: "Navigation", source: "common" },
  { name: "ChevronDownIcon", displayName: "chevron-down", category: "Navigation", source: "common" },
  { name: "ChevronLeftIcon", displayName: "chevron-left", category: "Navigation", source: "common" },
  { name: "ChevronRightIcon", displayName: "chevron-right", category: "Navigation", source: "common" }, // prettier-ignore
  { name: "CashwalkBizArrowUpIcon", displayName: "arrow-up", category: "Navigation", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizArrowDownIcon", displayName: "arrow-down", category: "Navigation", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizArrowRightIcon", displayName: "arrow-right", category: "Navigation", source: "cashwalk-biz" }, // prettier-ignore

  // Action (9)
  { name: "CloseIcon", displayName: "close", category: "Action", source: "common" },
  { name: "PlusIcon", displayName: "plus", category: "Action", source: "common" },
  { name: "SearchIcon", displayName: "search", category: "Action", source: "common" },
  { name: "DeleteIcon", displayName: "delete", category: "Action", source: "common" },
  { name: "EditIcon", displayName: "edit", category: "Action", source: "common" },
  { name: "CashwalkBizDeleteCircleIcon", displayName: "delete-circle", category: "Action", source: "cashwalk-biz" }, // prettier-ignore
  { name: "RefreshIcon", displayName: "refresh", category: "Action", source: "common" },
  { name: "FilterIcon", displayName: "filter", category: "Action", source: "common" },
  { name: "CashwalkBizSearchDeleteIcon", displayName: "search-delete", category: "Action", source: "cashwalk-biz" }, // prettier-ignore

  // Status (8)
  { name: "InfoIcon", displayName: "info", category: "Status", source: "common" },
  { name: "CashwalkBizQuestionIcon", displayName: "question", category: "Status", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCautionIcon", displayName: "caution", category: "Status", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizErrorIcon", displayName: "error", category: "Status", source: "cashwalk-biz" },
  { name: "CashwalkBizCheckIcon", displayName: "check", category: "Status", source: "cashwalk-biz" },
  { name: "CashwalkBizCheckCircleOnIcon", displayName: "check-circle-on", category: "Status", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCheckCircleOffIcon", displayName: "check-circle-off", category: "Status", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizOpenIcon", displayName: "open", category: "Status", source: "cashwalk-biz" },

  // Social (8)
  { name: "LikeIcon", displayName: "like", category: "Social", source: "common" },
  { name: "CommentIcon", displayName: "comment", category: "Social", source: "common" },
  { name: "ShareIcon", displayName: "share", category: "Social", source: "common" },
  { name: "CashwalkBizRippleIcon", displayName: "ripple", category: "Social", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizBubbleIcon", displayName: "bubble", category: "Social", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizMessageQuizIcon", displayName: "message-quiz", category: "Social", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizBannerIcon", displayName: "banner", category: "Social", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCalendarIcon", displayName: "calendar", category: "Social", source: "cashwalk-biz" }, // prettier-ignore

  // GNB (8)
  { name: "CashwalkBizGnbBannerIcon", displayName: "gnb-banner", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizGnbChannelIcon", displayName: "gnb-channel", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizGnbChatIcon", displayName: "gnb-chat", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizGnbQuizIcon", displayName: "gnb-quiz", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizGnbMemberIcon", displayName: "gnb-member", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizGnbSettingIcon", displayName: "gnb-setting", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizGnbCashIcon", displayName: "gnb-cash", category: "GNB", source: "cashwalk-biz" }, // prettier-ignore
  { name: "DownloadIcon", displayName: "download", category: "GNB", source: "common" },

  // Selection (6)
  { name: "CashwalkBizRadioOffIcon", displayName: "radio-off", category: "Selection", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizRadioOnIcon", displayName: "radio-on", category: "Selection", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCheckboxOffIcon", displayName: "checkbox-off", category: "Selection", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCheckboxOnIcon", displayName: "checkbox-on", category: "Selection", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCheckboxErrorIcon", displayName: "checkbox-error", category: "Selection", source: "cashwalk-biz" }, // prettier-ignore
  { name: "CashwalkBizCheckboxOnGreenIcon", displayName: "checkbox-on-green", category: "Selection", source: "cashwalk-biz" }, // prettier-ignore
];

export const CASHWALK_BIZ_CATEGORIES = [
  "Navigation",
  "Action",
  "Status",
  "Social",
  "GNB",
  "Selection",
];

/** packages/icons 배럴에서 export 된 *Icon 컴포넌트명 집합을 텍스트로 추출(빌드 불필요). */
async function readIconExports() {
  const src = await fs.readFile(iconsIndexPath, "utf8");
  const names = new Set();
  for (const m of src.matchAll(/export\s*\{\s*([A-Za-z][A-Za-z0-9_]*Icon)\b/g)) {
    names.add(m[1]);
  }
  return [...names].sort((a, b) => a.localeCompare(b));
}

export function buildCatalog(iconNames) {
  const known = new Set(iconNames);

  // CashwalkBiz 카탈로그의 모든 name 이 실제 export 와 일치하는지 검증(전사 오류 차단).
  const missing = CASHWALK_BIZ_CATALOG.filter((e) => !known.has(e.name));
  if (missing.length) {
    throw new Error(
      `[generate-icon-catalog] CashwalkBiz 카탈로그에 존재하지 않는 export 참조: ${missing
        .map((e) => e.name)
        .join(", ")}. @nudge-design/icons 빌드/이름을 확인하세요.`,
    );
  }

  const icons = iconNames.map((name) => ({
    name,
    kebab: pascalToKebab(name),
    project: projectOf(name),
  }));

  return {
    projects: PROJECTS,
    icons,
    cashwalkBiz: CASHWALK_BIZ_CATALOG,
  };
}

const iconNames = await readIconExports();
const catalog = buildCatalog(iconNames);
const body = `${JSON.stringify(catalog, null, 2)}\n`;

if (checkMode) {
  let current = null;
  try {
    current = await fs.readFile(outputPath, "utf8");
  } catch {
    current = null;
  }
  if (current !== body) {
    console.error(
      "[generate-icon-catalog] metadata/iconCatalog.json 이 stale 합니다. Run `pnpm generate:icon-catalog`.",
    );
    process.exit(1);
  }
  console.log(
    `[generate-icon-catalog] up to date (${path.relative(rootDir, outputPath)}, ${catalog.icons.length} icons)`,
  );
} else {
  await fs.writeFile(outputPath, body, "utf8");
  console.log(
    `Generated ${path.relative(rootDir, outputPath)} (${catalog.icons.length} icons, ${catalog.cashwalkBiz.length} CashwalkBiz)`,
  );
}
