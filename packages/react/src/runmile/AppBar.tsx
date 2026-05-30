import React from "react";
import { RunmileBackIcon } from "@nudge-design/icons";

/**
 * Runmile 모바일 헤더 (Figma 36:258, height 52, white bg).
 *
 * 3 가지 variant — 모두 같은 52h × 360w base 위에서 슬롯 배치만 다름.
 *
 *   - `variant="title-icon"` (default) : 좌측 back / 중앙 title (Medium 16/24) / 우측 actions
 *   - `variant="logo"`                 : 중앙 Runmile 로고 / 우측 actions
 *   - `variant="menu-title"`           : 좌측 back + title (Bold 20/24) / 우측 actions
 *
 * 우측 actions 는 children 으로 그대로 전달 — `<RunmileCalendarIcon>`,
 * `<RunmileSearchIcon>`, `<RunmileCloseIcon>` 같은 24px 아이콘 0~3 개. 사이 간격 14px
 * (Figma 36:258 — 아이콘 right 16/54/92, 피치 38px = 24 + gap 14).
 *
 * 색상은 모두 시멘틱 토큰 cascade.
 *   - bg: `--semantic-bg-surface-default` (#FFFFFF)
 *   - title / icon: `--semantic-icon-strong-default` (#221E1F, runmile black)
 */

export interface RunmileAppBarLogo {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface RunmileAppBarBack {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** 접근성 라벨. 기본 "뒤로". */
  ariaLabel?: string;
}

export interface RunmileAppBarProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  variant?: "title-icon" | "logo" | "menu-title";
  /** title-icon / menu-title 에서 사용. */
  title?: string;
  /** logo variant 에서 사용. fixture 의 mobile 로고 자산 (100×23 권장). */
  logo?: RunmileAppBarLogo;
  /** 좌측 back 버튼. 미지정 시 렌더 안 함. */
  back?: RunmileAppBarBack;
  /** 우측 아이콘 슬롯 (0~3 개). 24px 아이콘 권장. */
  children?: React.ReactNode;
}

const TITLE_COLOR = "var(--semantic-icon-strong-default, #221E1F)";
const ICON_COLOR = "var(--semantic-icon-strong-default, #221E1F)";

function BackButton({ back }: { back: RunmileAppBarBack }) {
  return (
    <button
      type="button"
      onClick={back.onClick}
      aria-label={back.ariaLabel ?? "뒤로"}
      style={{
        width: 24,
        height: 24,
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: ICON_COLOR,
        lineHeight: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <RunmileBackIcon size={24} />
    </button>
  );
}

function ActionsRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        color: ICON_COLOR,
      }}
    >
      {children}
    </div>
  );
}

export const RunmileAppBar = React.forwardRef<HTMLElement, RunmileAppBarProps>(
  ({ variant = "title-icon", title, logo, back, children, style, ...rest }, ref) => {
    const baseStyle: React.CSSProperties = {
      position: "relative",
      width: "100%",
      height: 52,
      background: "var(--semantic-bg-surface-default, #FFFFFF)",
      fontFamily:
        "var(--font-web, 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, sans-serif)",
      // 아이콘은 inline-flex(BackButton/ActionsRow)라 라인박스 baseline 에 얹힌다.
      // line-height 미지정 시 폰트 strut 의 descent(~4px)가 아이콘 아래에 생겨
      // 중앙정렬 박스가 커지고 아이콘이 ~2px 위로 떠 보인다. strut 제거.
      // (title/menu-title 텍스트는 각 span 이 lineHeight:"24px" 를 명시하므로 무관.)
      lineHeight: 0,
      ...style,
    };

    const showRight = React.Children.count(children) > 0;

    if (variant === "menu-title") {
      return (
        <header ref={ref} style={baseStyle} {...rest}>
          <div
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {back && <BackButton back={back} />}
            {title && (
              <span
                style={{
                  fontSize: 20,
                  lineHeight: "24px",
                  fontWeight: 700,
                  color: TITLE_COLOR,
                }}
              >
                {title}
              </span>
            )}
          </div>
          {showRight && (
            <div
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <ActionsRow>{children}</ActionsRow>
            </div>
          )}
        </header>
      );
    }

    if (variant === "logo") {
      return (
        <header ref={ref} style={baseStyle} {...rest}>
          {back && (
            <div
              style={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <BackButton back={back} />
            </div>
          )}
          {logo && (
            <img
              src={logo.src}
              alt={logo.alt ?? "Runmile"}
              width={logo.width ?? 100}
              height={logo.height ?? 23}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                display: "block",
              }}
            />
          )}
          {showRight && (
            <div
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <ActionsRow>{children}</ActionsRow>
            </div>
          )}
        </header>
      );
    }

    /* default: title-icon */
    return (
      <header ref={ref} style={baseStyle} {...rest}>
        {back && (
          <div
            style={{
              position: "absolute",
              left: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <BackButton back={back} />
          </div>
        )}
        {title && (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 16,
              lineHeight: "24px",
              fontWeight: 500,
              color: TITLE_COLOR,
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </span>
        )}
        {showRight && (
          <div
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ActionsRow>{children}</ActionsRow>
          </div>
        )}
      </header>
    );
  },
);

RunmileAppBar.displayName = "RunmileAppBar";
