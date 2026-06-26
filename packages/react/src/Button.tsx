import React from "react";
import { cv, fontWeight, radius, sizing, spacing, typeScale } from "@nudge-design/tokens";

export type ButtonVariant = "solid" | "soft" | "outlined" | "outlined-subtle";
export type ButtonSize = "xl" | "lg" | "md" | "sm" | "xs" | "mini" | "field";
export type ButtonColor = "primary" | "secondary" | "neutral" | "danger";
/**
 * Button shape.
 * - `default` : radius[8] (8px) — 일반 admin 폼/CTA · 페이지 내 액션
 * - `pill`    : radius full (9999px) — 모달 확인/취소, BottomCTA, 격식 컨텍스트
 *
 * Figma ButtonGuide(캐포비 3098:1032) 의 "When to use · Shape" 가이드와 정합.
 * 다른 프로젝트에서도 사용 가능 — radius 만 바꿈, color×variant 매트릭스와 직교.
 */
export type ButtonShape = "default" | "pill";

const SHAPE_RADIUS: Record<ButtonShape, string> = {
  default: `${radius[8]}px`,
  pill: "9999px",
};

const BUTTON_CLASS = "nds-button";
const BUTTON_LABEL_CLASS = `${BUTTON_CLASS}__label`;
const BUTTON_ICON_CLASS = `${BUTTON_CLASS}__icon`;
/* ─── Size config (피그마 실측 — Library node 171:8385 기준) ───
 * 버튼 높이는 sizing.button.{size} 토큰이 단일 source of truth.
 * padding-y 는 두지 않고 align-items: center 로 콘텐츠를 수직 정렬한다.
 *   (자연 높이 = line-height + 2px border < min-height 가 모든 사이즈에서 성립)
 *
 *   XL(52):    px 16 / 16·24 / icon 20 / gap 8
 *   L (48):    px 16 / 16·24 / icon 20 / gap 8
 *   M (44):    px 24 / 15·22 / icon 20 / gap 8
 *   S (42):    px 16 / 14·20 / icon 20 / gap 8
 *   XS(38):    px 16 / 13·18 / icon 18 / gap 6
 *   Field(48): px 16 / 15·22 / icon 20 / gap 8
 */

const sizeConfig = {
  xl: {
    height: sizing.button.xl,
    px: spacing[16],
    fontSize: typeScale.body1.fontSize,
    lineHeight: typeScale.body1.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  lg: {
    height: sizing.button.lg,
    px: spacing[16],
    fontSize: typeScale.body1.fontSize,
    lineHeight: typeScale.body1.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  md: {
    height: sizing.button.md,
    px: spacing[24],
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  sm: {
    height: sizing.button.sm,
    px: spacing[16],
    fontSize: typeScale.body3.fontSize,
    lineHeight: typeScale.body3.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
  xs: {
    height: sizing.button.xs,
    px: spacing[16],
    fontSize: typeScale.caption1.fontSize,
    lineHeight: typeScale.caption1.lineHeight,
    iconSize: 18,
    gap: spacing[6],
  },
  mini: {
    height: sizing.button.mini,
    px: spacing[12],
    fontSize: typeScale.caption1.fontSize,
    lineHeight: typeScale.caption1.lineHeight,
    iconSize: sizing.icon.xs,
    gap: spacing[4],
  },
  field: {
    height: sizing.button.field,
    px: spacing[16],
    fontSize: typeScale.body2.fontSize,
    lineHeight: typeScale.body2.lineHeight,
    iconSize: sizing.icon.sm,
    gap: spacing[8],
  },
} as const;

/* ─── Color × Variant 스타일 (피그마 508:6962 기반) ─── */

interface VariantStyle {
  background: string;
  text: string;
  border: string;
  fontWeight?: number;
}

interface VariantStyleSet {
  enabled: VariantStyle;
  disabled: VariantStyle;
  hover: VariantStyle;
}

const styleMap: Record<ButtonColor, Record<ButtonVariant, VariantStyleSet>> = {
  primary: {
    // Figma: Solid/Primary (eap-button-bg-*)
    solid: {
      enabled: {
        // Figma Solid/Primary = --semantic-button-bg-default (프로젝트 buttonBg override). bg-brand 직참조 금지.
        background: cv.button.bgDefault,
        text: cv.button.textDefault,
        border: cv.borderRole.brand,
      },
      disabled: {
        // Figma --semantic-button-bg-disabled = #9CA2AE.
        background: cv.button.bgDisabled,
        text: cv.textRole.inverse,
        border: cv.button.bgDisabled,
      },
      hover: {
        // semantic-button-bg-hover 슬롯 — project 별로 fill.brandHover 와 다른 hover 톤을 명시할 수 있다.
        // Runmile 의 경우 fill.brandHover (어두운 톤 #E84A28) 가 아닌 가벼운 톤 (orange/400 #FF805C) 이 SSOT.
        background: cv.button.bgHover,
        text: cv.button.textDefault,
        border: cv.button.bgHover,
      },
    },
    // Primary Soft — "project-tinted soft" 버튼.
    // bg = surface.brandSubtle (프로젝트별 옅은 project 톤) + text = textRole.brand (project 색).
    // 모든 프로젝트에서 일관: NudgeEAP=Blue/50, Trost=Indigo subtle, Geniet=Teal subtle, CashwalkBiz=Yellow/100.
    // (이전 statusInfo bg + project text 조합은 CashwalkBiz 처럼 project/info hue 가 다른 프로젝트에서
    //  파랑 bg + 노랑 text 같은 부조화가 발생.)
    soft: {
      enabled: {
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        // brandSubtle 에 대응하는 "한 단계 진한" 시멘틱 슬롯이 없어 default 와 동일 유지.
        // hover feedback 이 필요하면 향후 surface.brandSubtleHover 슬롯 신설 검토.
        background: cv.surface.brandSubtle,
        text: cv.textRole.brand,
        border: cv.surface.brandSubtle,
      },
    },
    // Figma: Outlined
    // Outlined/Primary — 전용 button-outlined 토큰 사용 (프로젝트별 분기: 캐포비 #111, 나머지 project색).
    // borderRole.brand/textRole.brand 직참조 금지 — 그러면 캐포비가 project 노랑으로 잘못 렌더됨.
    outlined: {
      enabled: {
        background: cv.button.bgOutlined,
        text: cv.button.textBrand,
        border: cv.button.borderOutlined,
      },
      disabled: {
        background: cv.button.bgOutlinedDisabled,
        text: cv.textRole.muted,
        border: cv.button.borderOutlinedDisabled,
      },
      hover: {
        background: cv.button.bgOutlinedHover,
        text: cv.button.textBrand,
        border: cv.button.borderOutlinedHover,
      },
    },
    // Outlined-Subtle/Primary — 캐시워크 가이드(262:1815): 옅은 외곽선(가장 낮은 강조). border=subtle, brand 텍스트.
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textBrand,
        border: cv.borderRole.subtle,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textBrand,
        border: cv.borderRole.subtle,
      },
    },
  },
  secondary: {
    // Figma: Solid/Secondary — 프로젝트별 의도가 다른 슬롯.
    //   · NudgeEAP : `--semantic-bg-brand-subtle` + project blue 텍스트
    //   · Trost    : 옅은 indigo bg (#EFF1FA) + indigo 텍스트
    //   · Geniet   : 검정 bg (#333333) + 흰 텍스트  ← dark inverse 패턴
    // 슬롯 자체가 프로젝트별 override 를 받으므로 컴포넌트는 슬롯만 박는다.
    solid: {
      enabled: {
        background: cv.button.bgSecondary,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondary,
      },
      disabled: {
        background: cv.button.bgSecondaryDisabled,
        text: cv.button.textSecondaryDisabled,
        border: cv.button.bgSecondaryDisabled,
      },
      hover: {
        background: cv.button.bgSecondaryHover,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondaryHover,
      },
    },
    // secondary soft = solid과 동일 (Figma에 별도 soft variant 없음)
    soft: {
      enabled: {
        background: cv.button.bgSecondary,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondary,
      },
      disabled: {
        background: cv.button.bgSecondaryDisabled,
        text: cv.button.textSecondaryDisabled,
        border: cv.button.bgSecondaryDisabled,
      },
      hover: {
        background: cv.button.bgSecondaryHover,
        text: cv.button.textSecondary,
        border: cv.button.bgSecondaryHover,
      },
    },
    // secondary outlined — Figma Outlined/Neutral 패턴 (white bg + neutral border + strong text).
    // dark-inverse 그룹(CashwalkBiz/Geniet) 에서 secondary.solid 가 검정/짙은 그레이 fill 이라
    // outlined 도 같은 위계의 "neutral 강조" 로 통일. light-subtle 그룹에서도 "primary 가 아닌
    // 2차 outlined CTA" 로 자연스러운 해석. (이전엔 primary.outlined 와 동일해 CashwalkBiz 에서
    // 노란 보더로 잘못 표시됐음.)
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.strong,
        border: cv.borderRole.normal,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.strong,
        border: cv.borderRole.normal,
      },
    },
    // Outlined-Subtle/Secondary — 옅은 외곽선(가장 낮은 강조). border=subtle, strong 텍스트.
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.strong,
        border: cv.borderRole.subtle,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.strong,
        border: cv.borderRole.subtle,
      },
    },
  },
  neutral: {
    // Solid/Neutral — `buttonBg.neutral` / `buttonText.neutral` 슬롯에서 project 별 톤 매핑.
    //   · NudgeEAP base : cool-gray fill + white text (#9CA2AE / #FFFFFF — 기존 패턴 유지)
    //   · Geniet        : neutral gray filled (#ECECEC) + gray text
    //   · Runmile       : light gray filled (#F2F4F6) + gray800 text
    solid: {
      enabled: {
        background: cv.button.bgNeutral,
        text: cv.button.textNeutralSolid,
        border: cv.button.bgNeutral,
      },
      disabled: {
        background: cv.button.bgNeutralDisabled,
        // Solid Neutral 텍스트 = fill 명도 대비 토큰(어두운 fill=흰, 밝은 fill=어두운 글자).
        text: cv.button.textNeutralSolid,
        border: cv.button.bgNeutralDisabled,
      },
      hover: {
        background: cv.button.bgNeutralHover,
        text: cv.button.textNeutralSolid,
        border: cv.button.bgNeutralHover,
      },
    },
    // Weak/Neutral — 연한 회색 fill + 진한 텍스트 (Figma 3098:1137/1148/1159).
    soft: {
      enabled: {
        background: cv.surface.section,
        text: cv.textRole.strong,
        border: cv.surface.section,
      },
      disabled: {
        background: cv.surface.subtle,
        text: cv.textRole.muted,
        border: cv.surface.subtle,
      },
      hover: {
        background: cv.borderRole.normal,
        text: cv.textRole.strong,
        border: cv.borderRole.normal,
      },
    },
    // Figma: Outlined/Neutral — neutral border + neutral text (Solid 와 enabled 텍스트 공용).
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textNeutral,
        border: cv.button.borderNeutral,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        // Outlined Disabled 텍스트는 project 별 다른 톤 (Figma 런마일 = gray600 #919CAA).
        text: cv.button.textNeutralDisabled,
        border: cv.button.borderNeutralDisabled,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textNeutral,
        border: cv.button.borderNeutral,
        fontWeight: fontWeight.medium,
      },
    },
    // Outlined-Subtle/Neutral — 캐시워크 가이드(262:1815)의 주력 저강조 보조 버튼. border=subtle, neutral 텍스트.
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.button.textNeutral,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.button.textNeutralDisabled,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.button.textNeutral,
        border: cv.borderRole.subtle,
        fontWeight: fontWeight.medium,
      },
    },
  },
  // Danger tone (red) — 캐시워크 가이드(262:1815). 인가 조합은 danger·outlined-subtle(저강조 위험 액션)이나,
  // 매트릭스 완전성을 위해 solid/soft/outlined 도 시멘틱 status-error 토큰으로 제공(raw hex 없음).
  danger: {
    solid: {
      enabled: {
        background: cv.fill.statusError,
        text: cv.textRole.inverse,
        border: cv.fill.statusError,
      },
      disabled: {
        background: cv.button.bgDisabled,
        text: cv.textRole.inverse,
        border: cv.button.bgDisabled,
      },
      hover: {
        background: cv.fill.statusError,
        text: cv.textRole.inverse,
        border: cv.fill.statusError,
      },
    },
    soft: {
      enabled: {
        background: cv.surface.statusError,
        text: cv.textRole.statusError,
        border: cv.surface.statusError,
      },
      disabled: {
        background: cv.borderRole.subtle,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.statusError,
        text: cv.textRole.statusError,
        border: cv.surface.statusError,
      },
    },
    outlined: {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.statusError,
        border: cv.borderRole.statusError,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.statusError,
        border: cv.borderRole.statusError,
      },
    },
    // 가이드 인가 조합 — 옅은 외곽 + red 텍스트(저강조 위험, 예: 삭제 보조).
    "outlined-subtle": {
      enabled: {
        background: cv.surface.default,
        text: cv.textRole.statusError,
        border: cv.borderRole.subtle,
      },
      disabled: {
        background: cv.surface.default,
        text: cv.textRole.muted,
        border: cv.borderRole.subtle,
      },
      hover: {
        background: cv.surface.subtle,
        text: cv.textRole.statusError,
        border: cv.borderRole.subtle,
      },
    },
  },
};

/* ─── Project-restricted variants ───
 * 각 프로젝트의 Figma 라이브러리에 존재하는 variant 만 화이트리스트로 명시.
 * 누락 키는 "제약 없음" 으로 간주한다. 런타임 영향 없음 — dev-only console.warn 만.
 *
 *   Geniet 207:1853 → Solid / Stroke(=Outlined) 두 스타일만 있음.
 *     soft 는 Geniet Figma 에 없음 → 사용 시 경고.
 */
const PROJECT_VARIANT_WHITELIST: Record<string, ReadonlyArray<ButtonVariant>> = {
  geniet: ["solid", "outlined"],
};

/* 프로젝트별 미정의 tone — 사용 시 경고. 캐포비 Figma ButtonGuide(3098:1032) 는 Primary + Neutral 만 정의,
 * Secondary tone 이 없음. 검정/회색 CTA 는 color="neutral" 사용(color="secondary" 아님). */
const PROJECT_TONE_DENYLIST: Record<string, ReadonlyArray<ButtonColor>> = {
  "cashwalk-biz": ["secondary"],
  // 런마일 ButtonGuide(5124:390) tone = Primary + Neutral 둘뿐. 검정 CTA = color="neutral".
  runmile: ["secondary"],
};

const warnedKeys = new Set<string>();
function warnIfProjectRestricted(
  project: string | null,
  variant: ButtonVariant,
  color: ButtonColor,
) {
  if (!project) return;
  const allow = PROJECT_VARIANT_WHITELIST[project];
  if (allow && !allow.includes(variant)) {
    const key = `${project}:v:${variant}`;
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(
        `[nds/Button] variant="${variant}" 는 project="${project}" Figma 가이드에 없음 — ` +
          `허용된 variant: [${allow.join(", ")}]. 디자인 인텐트가 어긋날 수 있어요.`,
      );
    }
  }
  const deny = PROJECT_TONE_DENYLIST[project];
  if (deny && deny.includes(color)) {
    const key = `${project}:c:${color}`;
    if (!warnedKeys.has(key)) {
      warnedKeys.add(key);
      console.warn(
        `[nds/Button] color="${color}" 는 project="${project}" Figma 가이드에 없는 tone 입니다. ` +
          `캐포비는 검정/회색 CTA 에 color="neutral" 을 쓰세요 (secondary 아님).`,
      );
    }
  }
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface ButtonSlotProps {
  /** 라벨 텍스트를 감싸는 `<span>` 엘리먼트에 전달할 props */
  label?: React.HTMLAttributes<HTMLSpanElement>;
  /** 좌측 아이콘을 감싸는 `<span>` 엘리먼트에 전달할 props */
  leftIcon?: React.HTMLAttributes<HTMLSpanElement>;
  /** 우측 아이콘을 감싸는 `<span>` 엘리먼트에 전달할 props */
  rightIcon?: React.HTMLAttributes<HTMLSpanElement>;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 버튼 색상 테마 */
  color?: ButtonColor;
  /**
   * 버튼 모양 (border-radius).
   * - `default` (기본) — radius[8] (8px), 일반 admin 액션
   * - `pill` — radius full (9999px), 모달 액션 / BottomCTA / 격식 컨텍스트
   */
  shape?: ButtonShape;
  /** 부모 너비에 맞춤 */
  fullWidth?: boolean;
  /** 라벨 왼쪽에 표시할 아이콘 */
  leftIcon?: React.ReactNode;
  /** 라벨 오른쪽에 표시할 아이콘 */
  rightIcon?: React.ReactNode;
  /** 라벨 래퍼에 추가할 클래스 */
  labelClassName?: string;
  /** 내부 슬롯별 props 전달 */
  slotProps?: ButtonSlotProps;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "lg",
      color = "primary",
      shape = "default",
      fullWidth = false,
      disabled,
      leftIcon,
      rightIcon,
      labelClassName,
      className,
      style,
      children,
      slotProps,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const sizeStyle = sizeConfig[size];
    const variantSet = styleMap[color][variant];
    const state = disabled ? variantSet.disabled : variantSet.enabled;
    const hover = variantSet.hover;

    // Project-aware 경고: process.env.NODE_ENV !== "production" 에서만, document 가 있을 때.
    // @types/node 의존 없이 process 를 안전하게 참조하기 위해 globalThis 캐스팅 사용.
    const proc = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
    if (proc && proc.env?.NODE_ENV !== "production" && typeof document !== "undefined") {
      const project = document.documentElement.getAttribute("data-project");
      warnIfProjectRestricted(project, variant, color);
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        data-slot="root"
        data-variant={variant}
        data-size={size}
        data-color={color}
        data-shape={shape}
        className={cx(BUTTON_CLASS, className)}
        style={
          {
            // 높이는 프로젝트가 size별로 override 가능 (지니어트 sm 40·xs 36). 미설정 시 base 토큰.
            "--nds-button-height": `var(--nds-button-height-${size}, ${sizeStyle.height}px)`,
            "--nds-button-padding-x": `${sizeStyle.px}px`,
            "--nds-button-gap": `${sizeStyle.gap}px`,
            "--nds-button-font-size": `${sizeStyle.fontSize}px`,
            "--nds-button-line-height": `${sizeStyle.lineHeight}px`,
            "--nds-button-icon-size": `${sizeStyle.iconSize}px`,
            "--nds-button-font-weight": state.fontWeight ?? 700,
            "--nds-button-radius": SHAPE_RADIUS[shape],
            "--nds-button-width": fullWidth ? "100%" : "auto",
            "--nds-button-background": state.background,
            "--nds-button-text-color": state.text,
            "--nds-button-border-color": state.border,
            "--nds-button-hover-background": hover.background,
            "--nds-button-hover-text-color": hover.text,
            "--nds-button-hover-border-color": hover.border,
            ...style,
          } as React.CSSProperties
        }
        {...rest}
      >
        {leftIcon && (
          <span
            data-slot="left-icon"
            className={cx(BUTTON_ICON_CLASS, slotProps?.leftIcon?.className)}
            style={slotProps?.leftIcon?.style}
            {...omitDomProps(slotProps?.leftIcon)}
          >
            {leftIcon}
          </span>
        )}
        <span
          data-slot="label"
          className={cx(BUTTON_LABEL_CLASS, labelClassName, slotProps?.label?.className)}
          style={slotProps?.label?.style}
          {...omitDomProps(slotProps?.label)}
        >
          {children}
        </span>
        {rightIcon && (
          <span
            data-slot="right-icon"
            className={cx(BUTTON_ICON_CLASS, slotProps?.rightIcon?.className)}
            style={slotProps?.rightIcon?.style}
            {...omitDomProps(slotProps?.rightIcon)}
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

function omitDomProps<T extends React.HTMLAttributes<HTMLElement> | undefined>(props: T) {
  if (!props) return {};
  const { className, style, children, ...rest } = props;
  return rest;
}
