import type { Meta, StoryObj } from "@storybook/react";
import { IconCatalog } from "@nudge-design/catalog";
import iconCatalog from "../../../../metadata/iconCatalog.json";

/**
 * Projects/Icons — 4개 프로젝트(Geniet · Trost · Runmile · CashwalkBiz)의 전용 아이콘 카탈로그.
 * 그리드·검색·복사는 공유 컴포넌트(@nudge-design/catalog)와 단일 구현을 공유하고,
 * 데이터는 metadata/iconCatalog.json 의 project 분류(또는 cashwalkBiz 큐레이션 섹션)에서 자동 분기.
 * 각 스토리가 `globals.project` 로 테마를 건다.
 *
 * 정책: 공통 컴포넌트(AppFooter/BottomNav)에 `if (project === …)` 분기를 박지 말고,
 * 사용처에서 명시적으로 import 해 전달. 프로젝트 모드 작업 시 공용 아이콘보다 이쪽을 우선 사용.
 */

const GENIET_COUNT = iconCatalog.icons.filter((i) => i.project === "geniet").length;
const TROST_COUNT = iconCatalog.icons.filter((i) => i.project === "trost").length;
const RUNMILE_COUNT = iconCatalog.icons.filter((i) => i.project === "runmile").length;
const CW = iconCatalog.cashwalkBiz;
const CW_COMMON_COUNT = CW.filter((e) => e.source === "common").length;
const CW_BIZ_COUNT = CW.filter((e) => e.source === "cashwalk-biz").length;

const meta: Meta<typeof IconCatalog> = {
  title: "Projects/Icons",
  // 사이드바·docs 에서 숨김 — "Projects/<Project>/개요" mdx 의 <Canvas> 로 본다.
  tags: ["!dev", "!autodocs"],
  component: IconCatalog,
  parameters: { layout: "padded" },
  args: {
    data: iconCatalog,
    copyMode: "name",
    iconSize: 24,
  },
};
export default meta;
type Story = StoryObj<typeof IconCatalog>;

/* 프로젝트별 기본 args — 각 스토리에 spread */
const GENIET_ARGS = { mode: "single-project", project: "geniet" } as const;
const TROST_ARGS = {
  mode: "single-project",
  project: "trost",
  searchPlaceholder: "이름으로 검색 (예: mental, testresult, link)",
} as const;
const RUNMILE_ARGS = { mode: "single-project", project: "runmile" } as const;
const CASHWALK_ARGS = {
  mode: "cashwalk-biz",
  searchPlaceholder: "이름·카테고리로 검색 (예: gnb, check, arrow)",
} as const;

/* ═══════════════════ Geniet ═══════════════════ */

export const GenietAll: Story = {
  name: "Geniet/전체",
  globals: { project: "geniet" },
  args: { ...GENIET_ARGS },
  parameters: {
    docs: {
      description: {
        story: [
          `**Geniet 프로젝트 전용 아이콘 ${GENIET_COUNT}종.**`,
          "공용 아이콘과 별개로 Geniet 디자인 그대로 가져온 변종. 프로젝트 모드(project='geniet')에서 우선 사용.",
          "사용 예: `<GenietRecordIcon size={24} />` — color 는 부모(예: AppFooter nav-item) cascade 따라감.",
        ].join("\n\n"),
      },
    },
  },
};

export const GenietProjectTint: Story = {
  name: "Geniet/Project 색",
  globals: { project: "geniet" },
  args: { ...GENIET_ARGS, iconColor: "var(--semantic-icon-brand-default)" },
  parameters: {
    docs: {
      description: {
        story:
          "Geniet project 컬러(`--semantic-icon-brand-default`) 로 렌더링. 프로젝트 테마가 적용된 토큰을 따릅니다.",
      },
    },
  },
};

export const GenietSize20: Story = {
  name: "Geniet/Size 20 (Button 내부)",
  globals: { project: "geniet" },
  args: { ...GENIET_ARGS, iconSize: 20 },
};

export const GenietOnDark: Story = {
  name: "Geniet/다크 배경",
  globals: { project: "geniet" },
  args: { ...GENIET_ARGS, surface: "dark" },
};

/* ═══════════════════ Trost ═══════════════════ */

export const TrostAll: Story = {
  name: "Trost/전체",
  globals: { project: "trost" },
  args: { ...TROST_ARGS },
  parameters: {
    docs: {
      description: {
        story: [
          `**Trost 프로젝트 전용 아이콘 ${TROST_COUNT}종.**`,
          "Trost 홈페이지의 mental 카테고리 / 검사 결과 / SNS 링크 / 마인드키 심볼 / 에너지·심리검사 아이콘을 24×24, currentColor 로 정규화.",
          "사용 예: `<TrostMentalDepressionIcon size={32} color='var(--semantic-icon-strong-default)' />`",
        ].join("\n\n"),
      },
    },
  },
};

export const TrostProjectTint: Story = {
  name: "Trost/Project 색 (indigo)",
  globals: { project: "trost" },
  args: { ...TROST_ARGS, iconColor: "var(--semantic-border-focus-default, #4968FF)" },
  parameters: {
    docs: {
      description: {
        story:
          "Trost focus·info 컬러(`--semantic-border-focus-default`, #4968FF) 로 렌더링. Trost primary 는 노랑이지만 노란 배경 위 가독성 때문에 indigo 를 project tint 로 사용.",
      },
    },
  },
};

export const TrostSize32: Story = {
  name: "Trost/Size 32 (mental 카테고리 칩)",
  globals: { project: "trost" },
  args: { ...TROST_ARGS, iconSize: 32 },
  parameters: {
    docs: {
      description: {
        story: "Trost 멘탈 카테고리 칩은 32×32 로 사용되는 게 다수 — 원본 viewBox 도 32×32.",
      },
    },
  },
};

export const TrostSize20: Story = {
  name: "Trost/Size 20 (Button 내부)",
  globals: { project: "trost" },
  args: { ...TROST_ARGS, iconSize: 20 },
};

export const TrostOnDark: Story = {
  name: "Trost/다크 배경",
  globals: { project: "trost" },
  args: { ...TROST_ARGS, surface: "dark" },
};

/* ═══════════════════ Runmile ═══════════════════ */

export const RunmileAll: Story = {
  name: "Runmile/전체",
  globals: { project: "runmile" },
  args: { ...RUNMILE_ARGS },
  parameters: {
    docs: {
      description: {
        story: [
          `**Runmile 프로젝트 아이콘 ${RUNMILE_COUNT}종.**`,
          "5 컬러 슬롯(black/white/gray600/gray800/orange500)은 시멘틱 토큰(`--semantic-icon-{strong,inverse,muted,normal,project}-default`)으로 매핑.",
          "사용 예: `<RunmileHomeIcon size={24} />` — color 는 부모(예: BottomNav nav-item) cascade 따라감.",
        ].join("\n\n"),
      },
    },
  },
};

export const RunmileMuted: Story = {
  name: "Runmile/Muted (gray600)",
  globals: { project: "runmile" },
  args: { ...RUNMILE_ARGS, iconColor: "var(--semantic-icon-muted-default)" },
  parameters: {
    docs: { description: { story: "비활성 nav-item 등에 쓰는 muted 슬롯(gray600) 렌더링." } },
  },
};

export const RunmileProjectTint: Story = {
  name: "Runmile/Project 색 (orange500)",
  globals: { project: "runmile" },
  args: { ...RUNMILE_ARGS, iconColor: "var(--semantic-icon-brand-default)" },
  parameters: {
    docs: {
      description: {
        story: "Runmile primary(orange500) = `--semantic-icon-brand-default` 렌더링.",
      },
    },
  },
};

export const RunmileSize20: Story = {
  name: "Runmile/Size 20 (Button 내부)",
  globals: { project: "runmile" },
  args: { ...RUNMILE_ARGS, iconSize: 20 },
};

export const RunmileOnDark: Story = {
  name: "Runmile/다크 배경",
  globals: { project: "runmile" },
  args: { ...RUNMILE_ARGS, surface: "dark" },
};

/* ═══════════════════ CashwalkBiz ═══════════════════ */

export const CashwalkBizAll: Story = {
  name: "CashwalkBiz/전체",
  globals: { project: "cashwalk-biz" },
  args: { ...CASHWALK_ARGS },
  parameters: {
    docs: {
      description: {
        story: [
          `**캐포비 어드민 전용 아이콘 ${CW.length}종.** Figma 캐포비-Library / IconLibraryGuide (3112:948) SSOT.`,
          `- \`common\` (${CW_COMMON_COUNT}) — 공용 아이콘 재사용 (chevron/close/search 등).`,
          `- \`cashwalk-biz\` (${CW_BIZ_COUNT}) — 캐포비 전용 글리프 (\`CashwalkBiz*Icon\`).`,
        ].join("\n\n"),
      },
    },
  },
};

export const CashwalkBizProjectTint: Story = {
  name: "CashwalkBiz/Project 색",
  globals: { project: "cashwalk-biz" },
  args: { ...CASHWALK_ARGS, iconColor: "var(--semantic-icon-brand-default)" },
  parameters: {
    docs: { description: { story: "캐포비 project 컬러(`--semantic-icon-brand-default`) 렌더링." } },
  },
};

export const CashwalkBizSize20: Story = {
  name: "CashwalkBiz/Size 20 (Button 내부)",
  globals: { project: "cashwalk-biz" },
  args: { ...CASHWALK_ARGS, iconSize: 20 },
};

export const CashwalkBizOnDark: Story = {
  name: "CashwalkBiz/다크 배경",
  globals: { project: "cashwalk-biz" },
  args: { ...CASHWALK_ARGS, surface: "dark" },
};
