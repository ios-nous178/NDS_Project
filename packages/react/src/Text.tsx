import React, { useLayoutEffect, useRef, useState } from "react";
import { cv, fontWeight, typeScale } from "@nudge-design/tokens";

/**
 * Text — 타이포 primitive. 타입 스케일(variant)·시맨틱 색(tone)·weight 를 토큰에서만 받아
 * 임의의 텍스트에 거는 얇은 컴포넌트. Heading 의 body 짝 — "제목+설명 묶음"은 Heading,
 * "한 덩이의 텍스트(본문·라벨·메타·캡션)"는 Text.
 *
 * expandable: 길면 '더보기/접기' 토글(구 ExpandableText 흡수). 평소엔 순수 presentational.
 * 색·폰트의 브랜드 차이는 컴포넌트가 모름 — `--semantic-text-*`(tone) 토큰이 흘려보낸다.
 */

const TEXT_CLASS = "nds-text";
const TEXT_EXPANDABLE_CLASS = "nds-text-expandable";
const TEXT_TOGGLE_CLASS = "nds-text__toggle";

export type TextVariant = keyof typeof typeScale;
export type TextTone = keyof typeof cv.textRole;
export type TextWeight = keyof typeof fontWeight;
export type TextElement = "span" | "p" | "div" | "label" | "strong" | "em" | "small";

const TONE_CLASS: Record<TextTone, string> = {
  strong: "nds-text-tone-strong",
  normal: "nds-text-tone-normal",
  subtle: "nds-text-tone-subtle",
  muted: "nds-text-tone-muted",
  disabled: "nds-text-tone-disabled",
  inverse: "nds-text-tone-inverse",
  brand: "nds-text-tone-brand",
  brandStrong: "nds-text-tone-brand-strong",
  point: "nds-text-tone-point",
  pointStrong: "nds-text-tone-point-strong",
  statusSuccess: "nds-text-tone-status-success",
  statusError: "nds-text-tone-status-error",
  statusCaution: "nds-text-tone-status-caution",
  statusInfo: "nds-text-tone-status-info",
};

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "color"> {
  /** 타이포 스케일 (size + line-height) — display1 … label. @default 'body1' */
  variant?: TextVariant;
  /** 시맨틱 색 — strong/normal/subtle/muted/.../status*. @default 'normal' */
  tone?: TextTone;
  /** font-weight override (지정 없으면 regular). */
  weight?: TextWeight;
  /** 렌더 태그. @default 'span' */
  as?: TextElement;
  /** N 줄로 클램프 (CSS line-clamp, JS 없음). */
  maxLines?: number;
  /** 길면 '더보기/접기' 토글 — clamp + 오버플로 측정. maxLines 없으면 3줄 기준. */
  expandable?: boolean;
  /** 더보기 라벨 @default '더보기' */
  expandLabel?: string;
  /** 접기 라벨 @default '접기' */
  collapseLabel?: string;
  /** 한 번 펼치면 접기 버튼 숨김 (약관 등) */
  hideCollapse?: boolean;
  /** 펼침 상태 외부 제어 (expandable) */
  expanded?: boolean;
  /** 펼침 상태 변경 콜백 (expandable) */
  onExpandedChange?: (expanded: boolean) => void;
  children?: React.ReactNode;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      variant = "body1",
      tone = "normal",
      weight,
      as = "span",
      maxLines,
      expandable = false,
      expandLabel = "더보기",
      collapseLabel = "접기",
      hideCollapse = false,
      expanded: expandedProp,
      onExpandedChange,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const bodyClass = cx(
      TEXT_CLASS,
      `nds-text-${variant}`,
      TONE_CLASS[tone],
      weight && `nds-text-weight-${weight}`,
    );

    /* expandable 상태 — hooks 는 조건과 무관하게 항상 호출 */
    const isControlled = expandedProp !== undefined;
    const [internal, setInternal] = useState(false);
    const expanded = isControlled ? expandedProp! : internal;
    const bodyRef = useRef<HTMLElement>(null);
    const [overflowing, setOverflowing] = useState(false);
    const collapsedLines = maxLines ?? 3;

    useLayoutEffect(() => {
      if (!expandable) return;
      const el = bodyRef.current;
      if (!el) return;
      // 측정은 항상 clamp 해제 상태의 scrollHeight 기준으로
      const wasClamped = el.dataset.clamped === "true";
      el.dataset.clamped = "false";
      const full = el.scrollHeight;
      el.dataset.clamped = wasClamped ? "true" : "false";
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      const limit = lh * collapsedLines;
      setOverflowing(full > limit + 1);
    }, [expandable, collapsedLines, children]);

    /* ── non-expandable: 순수 presentational (+ 정적 maxLines clamp) ── */
    if (!expandable) {
      const clamp = maxLines != null;
      const Tag = as as "span";
      return (
        <Tag
          ref={ref as React.Ref<HTMLSpanElement>}
          className={cx(bodyClass, className)}
          data-clamped={clamp ? "true" : undefined}
          style={
            clamp ? ({ "--nds-text-max-lines": maxLines, ...style } as React.CSSProperties) : style
          }
          {...rest}
        >
          {children}
        </Tag>
      );
    }

    /* ── expandable: clamp + '더보기/접기' (구 ExpandableText 흡수) ── */
    const toggle = () => {
      const next = !expanded;
      if (!isControlled) setInternal(next);
      onExpandedChange?.(next);
    };
    const showToggle = overflowing && (!expanded || !hideCollapse);
    const BodyTag = as as "p";

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-slot="root"
        className={cx(TEXT_EXPANDABLE_CLASS, className)}
        style={{ "--nds-text-max-lines": collapsedLines, ...style } as React.CSSProperties}
        {...rest}
      >
        <BodyTag
          ref={bodyRef as React.Ref<HTMLParagraphElement>}
          className={bodyClass}
          data-clamped={!expanded && overflowing ? "true" : "false"}
        >
          {children}
        </BodyTag>
        {showToggle && (
          <button
            type="button"
            className={TEXT_TOGGLE_CLASS}
            onClick={toggle}
            aria-expanded={expanded}
          >
            {expanded ? collapseLabel : expandLabel}
          </button>
        )}
      </div>
    );
  },
);

Text.displayName = "Text";
