import React from "react";
import { cv, fontFamily, fontWeight } from "@nudge-eap/tokens";
import { Avatar, type AvatarSize } from "./Avatar";

/* ─── Constants ─── */

const AG_CLASS = "nds-avatar-group";
const AG_ITEM_CLASS = `${AG_CLASS}__item`;
const AG_MORE_CLASS = `${AG_CLASS}__more`;

const sizeOverlap: Record<AvatarSize, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
};

const sizePx: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

/* ─── Types ─── */

export interface AvatarGroupItem {
  /** 이미지 URL */
  src?: string | null;
  /** 이름 (이미지 없을 때 이니셜) */
  name?: string;
  /** alt */
  alt?: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 아바타 목록 */
  items: AvatarGroupItem[];
  /** 표시할 최대 개수 (초과분은 +N) */
  max?: number;
  /** 크기 */
  size?: AvatarSize;
  /** 겹침 정도 px (size별 기본값 자동) */
  overlap?: number;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const agStyles = `
  :where(.${AG_CLASS}) {
    display: inline-flex;
    align-items: center;
    font-family: ${fontFamily.web};
  }

  :where(.${AG_ITEM_CLASS}) {
    margin-left: calc(-1 * var(--nds-avatar-group-overlap, 12px));
    border: 2px solid ${cv.surface.default};
    border-radius: 9999px;
    box-sizing: content-box;
  }

  :where(.${AG_ITEM_CLASS}:first-child) { margin-left: 0; }

  :where(.${AG_MORE_CLASS}) {
    margin-left: calc(-1 * var(--nds-avatar-group-overlap, 12px));
    width: var(--nds-avatar-group-more-size, 40px);
    height: var(--nds-avatar-group-more-size, 40px);
    border-radius: 9999px;
    background: ${cv.surface.section};
    color: ${cv.textRole.subtle};
    border: 2px solid ${cv.surface.default};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: var(--nds-avatar-group-more-font, 13px);
    font-weight: ${fontWeight.semibold};
    box-sizing: content-box;
  }
`;

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ items, max = 4, size = "md", overlap, className, style, ...rest }, ref) => {
    const visible = items.slice(0, max);
    const remaining = items.length - visible.length;
    const overlapPx = overlap ?? sizeOverlap[size];
    const moreSize = sizePx[size];
    const moreFont =
      size === "xs" ? 10 : size === "sm" ? 12 : size === "lg" ? 14 : size === "xl" ? 16 : 13;

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(AG_CLASS, className)}
        style={
          {
            "--nds-avatar-group-overlap": `${overlapPx}px`,
            "--nds-avatar-group-more-size": `${moreSize}px`,
            "--nds-avatar-group-more-font": `${moreFont}px`,
            ...style,
          } as React.CSSProperties
        }
        aria-label={`총 ${items.length}명`}
        {...rest}
      >
        {visible.map((item, i) => (
          <Avatar
            key={i}
            className={AG_ITEM_CLASS}
            src={item.src}
            name={item.name}
            alt={item.alt ?? item.name ?? ""}
            size={size}
          />
        ))}
        {remaining > 0 && (
          <span className={AG_MORE_CLASS} aria-label={`외 ${remaining}명`}>
            +{remaining}
          </span>
        )}
      </div>
    );
  },
);

AvatarGroup.displayName = "AvatarGroup";
