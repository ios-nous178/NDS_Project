import React from "react";
import { Avatar, avatarSizeConfig, type AvatarShape, type AvatarSize } from "./Avatar";

/* ─── Constants ─── */

const AG_CLASS = "nds-avatar-group";
const AG_ITEM_CLASS = `${AG_CLASS}__item`;
const AG_MORE_CLASS = `${AG_CLASS}__more`;

/** 겹침 px — Avatar 사이즈(24/32/48/64/96) 대비 ~1/3. px/font 는 avatarSizeConfig 에서 파생. */
const sizeOverlap: Record<AvatarSize, number> = {
  xs: 8,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
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
  /** 아바타 모양 (기본 circle) — 그룹 내 전 아바타에 적용 */
  shape?: AvatarShape;
  /** 겹침 정도 px (size별 기본값 자동) */
  overlap?: number;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ items, max = 4, size = "md", shape = "circle", overlap, className, style, ...rest }, ref) => {
    const visible = items.slice(0, max);
    const remaining = items.length - visible.length;
    const overlapPx = overlap ?? sizeOverlap[size];
    const moreSize = avatarSizeConfig[size].size;
    const moreFont = avatarSizeConfig[size].fontSize;

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
            shape={shape}
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
