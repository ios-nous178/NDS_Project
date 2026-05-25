import React, { useRef, useState } from "react";

/* ─── Constants ─── */

const PR_CLASS = "nds-pull-to-refresh";
const PR_INDICATOR_CLASS = `${PR_CLASS}__indicator`;
const PR_CONTENT_CLASS = `${PR_CLASS}__content`;
const PR_SPINNER_CLASS = `${PR_CLASS}__spinner`;
const PR_LABEL_CLASS = `${PR_CLASS}__label`;

/* ─── Types ─── */

export interface PullToRefreshProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 새로고침 콜백 (Promise 반환 시 자동 종료) */
  onRefresh: () => void | Promise<void>;
  /** 콘텐츠 */
  children: React.ReactNode;
  /** 트리거 임계값 (px) */
  threshold?: number;
  /** 끌어내림 라벨 */
  pullLabel?: string;
  /** 놓으면 새로고침 라벨 */
  releaseLabel?: string;
  /** 새로고침 중 라벨 */
  refreshingLabel?: string;
  /** 비활성화 (스크롤 중 등) */
  disabled?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      onRefresh,
      children,
      threshold = 64,
      pullLabel = "당겨서 새로고침",
      releaseLabel = "놓으면 새로고침",
      refreshingLabel = "새로고침 중...",
      disabled = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const startRef = useRef<number | null>(null);
    const [pull, setPull] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [animate, setAnimate] = useState(false);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (disabled || refreshing) return;
      // 최상단에서만 시작
      const target = e.currentTarget as HTMLDivElement;
      if (target.scrollTop > 0) return;
      startRef.current = e.clientY;
      setAnimate(false);
    };
    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (startRef.current === null) return;
      const delta = e.clientY - startRef.current;
      if (delta < 0) {
        setPull(0);
        return;
      }
      // 저항감
      setPull(Math.min(delta * 0.6, threshold * 1.6));
    };
    const onPointerUp = async () => {
      if (startRef.current === null) return;
      const startedRefresh = pull >= threshold;
      startRef.current = null;
      setAnimate(true);
      if (startedRefresh) {
        setRefreshing(true);
        setPull(threshold);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
          setPull(0);
        }
      } else {
        setPull(0);
      }
    };

    const label = refreshing ? refreshingLabel : pull >= threshold ? releaseLabel : pullLabel;

    return (
      <div
        ref={ref}
        data-slot="root"
        className={cx(PR_CLASS, className)}
        style={
          {
            "--nds-ptr-pull": `${pull}px`,
            "--nds-ptr-anim": animate ? "240ms" : "0ms",
            ...style,
          } as React.CSSProperties
        }
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        {...rest}
      >
        <div className={PR_INDICATOR_CLASS} aria-live="polite">
          {refreshing && <span className={PR_SPINNER_CLASS} aria-hidden />}
          <span className={PR_LABEL_CLASS}>{label}</span>
        </div>
        <div className={PR_CONTENT_CLASS}>{children}</div>
      </div>
    );
  },
);

PullToRefresh.displayName = "PullToRefresh";
