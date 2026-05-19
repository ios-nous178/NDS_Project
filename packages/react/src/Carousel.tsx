import React, { useCallback, useEffect, useRef, useState } from "react";
import { cv, radius, spacing, transition } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const CR_CLASS = "nds-carousel";
const CR_VIEWPORT_CLASS = `${CR_CLASS}__viewport`;
const CR_TRACK_CLASS = `${CR_CLASS}__track`;
const CR_SLIDE_CLASS = `${CR_CLASS}__slide`;
const CR_INDICATORS_CLASS = `${CR_CLASS}__indicators`;
const CR_DOT_CLASS = `${CR_CLASS}__dot`;
const CR_NAV_CLASS = `${CR_CLASS}__nav`;
const CR_COUNTER_CLASS = `${CR_CLASS}__counter`;

/* ─── Types ─── */

export type CarouselIndicator = "dots" | "counter" | "none";

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 슬라이드 콘텐츠 */
  children: React.ReactNode;
  /** 활성 인덱스 (controlled) */
  activeIndex?: number;
  /** 활성 인덱스 변경 콜백 */
  onActiveIndexChange?: (index: number) => void;
  /** 자동 재생 ms 단위. undefined면 비활성 */
  autoplay?: number;
  /** 한 번에 이동하는 슬라이드 수 (보통 1) */
  step?: number;
  /** 인디케이터 표시 종류 */
  indicator?: CarouselIndicator;
  /** 좌우 화살표 표시 (마우스 호버 시) */
  showArrows?: boolean;
  /** 슬라이드 사이 간격 px */
  gap?: number;
  /** 루프 (마지막에서 다음 → 첫번째로) */
  loop?: boolean;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const carouselStyles = `
  :where(.${CR_CLASS}) {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  :where(.${CR_VIEWPORT_CLASS}) {
    overflow: hidden;
    border-radius: var(--nds-carousel-radius, ${radius.lg}px);
    width: 100%;
  }

  :where(.${CR_TRACK_CLASS}) {
    display: flex;
    transition: transform 320ms cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: transform;
  }

  :where(.${CR_TRACK_CLASS}[data-grabbing="true"]) {
    transition: none;
  }

  :where(.${CR_SLIDE_CLASS}) {
    flex: 0 0 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  :where(.${CR_INDICATORS_CLASS}) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--gap-default);
    margin-top: ${spacing[16]}px;
  }

  :where(.${CR_DOT_CLASS}) {
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    border: none;
    background: ${cv.borderRole.normal};
    padding: 0;
    cursor: pointer;
    transition: background-color ${transition.default}, width ${transition.default};
  }

  :where(.${CR_DOT_CLASS}[data-active="true"]) {
    background: ${cv.iconRole.brand};
    width: 18px;
  }

  :where(.${CR_DOT_CLASS}:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CR_NAV_CLASS}) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.92);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.18);
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${cv.textRole.normal};
    z-index: 1;
    opacity: 0;
    transition: opacity ${transition.default};
  }

  :where(.${CR_CLASS}:hover) :where(.${CR_NAV_CLASS}) {
    opacity: 1;
  }

  :where(.${CR_NAV_CLASS}[data-side="prev"]) { left: ${spacing[8]}px; }
  :where(.${CR_NAV_CLASS}[data-side="next"]) { right: ${spacing[8]}px; }

  :where(.${CR_NAV_CLASS}:focus-visible) {
    opacity: 1;
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${CR_NAV_CLASS}[disabled]) {
    opacity: 0;
    pointer-events: none;
  }

  :where(.${CR_COUNTER_CLASS}) {
    position: absolute;
    bottom: ${spacing[8]}px;
    right: ${spacing[8]}px;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    border-radius: 9999px;
    padding: 4px 10px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      children,
      activeIndex,
      onActiveIndexChange,
      autoplay,
      step = 1,
      indicator = "dots",
      showArrows = true,
      gap = 0,
      loop = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const slides = React.Children.toArray(children);
    const total = slides.length;
    const isControlled = activeIndex !== undefined;
    const [internal, setInternal] = useState(0);
    const idx = isControlled ? activeIndex! : internal;

    const dragRef = useRef<{ startX: number; deltaX: number; w: number } | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [grabbing, setGrabbing] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const goTo = useCallback(
      (next: number) => {
        let target = next;
        if (loop) target = (next + total) % total;
        else target = Math.max(0, Math.min(total - 1, next));
        if (!isControlled) setInternal(target);
        onActiveIndexChange?.(target);
      },
      [isControlled, loop, onActiveIndexChange, total],
    );

    const goPrev = useCallback(() => goTo(idx - step), [goTo, idx, step]);
    const goNext = useCallback(() => goTo(idx + step), [goTo, idx, step]);

    useEffect(() => {
      if (!autoplay || total <= 1) return;
      const timer = setInterval(() => {
        goTo(idx + step);
      }, autoplay);
      return () => clearInterval(timer);
    }, [autoplay, goTo, idx, step, total]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const w = trackRef.current.getBoundingClientRect().width;
      dragRef.current = { startX: e.clientX, deltaX: 0, w };
      setGrabbing(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      dragRef.current.deltaX = e.clientX - dragRef.current.startX;
      setDragOffset(dragRef.current.deltaX);
    };
    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      const { deltaX, w } = dragRef.current;
      const threshold = w * 0.15;
      if (deltaX > threshold) goPrev();
      else if (deltaX < -threshold) goNext();
      dragRef.current = null;
      setGrabbing(false);
      setDragOffset(0);
      (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    };

    const translateX = `calc(${-idx * 100}% + ${dragOffset}px)`;
    const trackStyle: React.CSSProperties = {
      transform: `translateX(${translateX})`,
      gap: gap ? `${gap}px` : undefined,
    };

    return (
      <div ref={ref} data-slot="root" className={cx(CR_CLASS, className)} {...rest}>
        <div
          className={CR_VIEWPORT_CLASS}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={trackRef}
            className={CR_TRACK_CLASS}
            data-grabbing={grabbing ? "true" : "false"}
            style={trackStyle}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className={CR_SLIDE_CLASS}
                data-slot="slide"
                aria-hidden={i !== idx}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${total}`}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {showArrows && total > 1 && (
          <>
            <button
              type="button"
              className={CR_NAV_CLASS}
              data-side="prev"
              aria-label="이전"
              disabled={!loop && idx === 0}
              onClick={goPrev}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M10 4L6 8l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className={CR_NAV_CLASS}
              data-side="next"
              aria-label="다음"
              disabled={!loop && idx === total - 1}
              onClick={goNext}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {indicator === "counter" && total > 1 && (
          <div className={CR_COUNTER_CLASS} data-slot="counter">
            {idx + 1} / {total}
          </div>
        )}

        {indicator === "dots" && total > 1 && (
          <div className={CR_INDICATORS_CLASS} data-slot="indicators" role="tablist">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={CR_DOT_CLASS}
                data-active={i === idx ? "true" : "false"}
                aria-label={`${i + 1}번 슬라이드로 이동`}
                aria-selected={i === idx}
                role="tab"
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);

Carousel.displayName = "Carousel";
