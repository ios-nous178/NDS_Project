import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const LB_CLASS = "nds-lightbox";
const LB_BACKDROP_CLASS = `${LB_CLASS}__backdrop`;
const LB_IMG_CLASS = `${LB_CLASS}__img`;
const LB_CLOSE_CLASS = `${LB_CLASS}__close`;
const LB_NAV_CLASS = `${LB_CLASS}__nav`;
const LB_COUNTER_CLASS = `${LB_CLASS}__counter`;
const LB_CAPTION_CLASS = `${LB_CLASS}__caption`;

/* ─── Types ─── */

export interface LightboxImage {
  /** 이미지 URL */
  src: string;
  /** alt 텍스트 */
  alt?: string;
  /** 캡션 (이미지 아래 표시) */
  caption?: React.ReactNode;
}

export interface LightboxProps {
  /** 열림 여부 */
  open: boolean;
  /** 이미지 목록 */
  images: LightboxImage[];
  /** 시작 인덱스 (controlled용) */
  index?: number;
  /** 인덱스 변경 콜백 */
  onIndexChange?: (i: number) => void;
  /** 닫기 콜백 */
  onClose: () => void;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const lbStyles = `
  :where(.${LB_BACKDROP_CLASS}) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.92);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: ${fontFamily.web};
  }

  :where(.${LB_IMG_CLASS}) {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    user-select: none;
  }

  :where(.${LB_CLOSE_CLASS}) {
    position: absolute;
    top: ${spacing[16]}px;
    right: ${spacing[16]}px;
    width: 40px;
    height: 40px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default};
  }
  :where(.${LB_CLOSE_CLASS}:hover) { background: rgba(255, 255, 255, 0.22); }
  :where(.${LB_CLOSE_CLASS}:focus-visible) {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  :where(.${LB_NAV_CLASS}) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: background-color ${transition.default};
  }
  :where(.${LB_NAV_CLASS}:hover) { background: rgba(255, 255, 255, 0.22); }
  :where(.${LB_NAV_CLASS}[data-side="prev"]) { left: ${spacing[16]}px; }
  :where(.${LB_NAV_CLASS}[data-side="next"]) { right: ${spacing[16]}px; }
  :where(.${LB_NAV_CLASS}[disabled]) {
    opacity: 0.3;
    cursor: not-allowed;
  }

  :where(.${LB_COUNTER_CLASS}) {
    position: absolute;
    top: ${spacing[16]}px;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.medium};
    background: rgba(0, 0, 0, 0.5);
    padding: 6px 12px;
    border-radius: 9999px;
  }

  :where(.${LB_CAPTION_CLASS}) {
    margin-top: ${spacing[16]}px;
    color: #fff;
    text-align: center;
    max-width: 80vw;
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
  }
`;

/* ─── Component ─── */

export const Lightbox: React.FC<LightboxProps> = ({
  open,
  images,
  index: indexProp,
  onIndexChange,
  onClose,
}) => {
  const isControlled = indexProp !== undefined;
  const [internal, setInternal] = useState(0);
  const idx = isControlled ? indexProp! : internal;

  const setIdx = useCallback(
    (next: number) => {
      const total = images.length;
      const clamped = Math.max(0, Math.min(total - 1, next));
      if (!isControlled) setInternal(clamped);
      onIndexChange?.(clamped);
    },
    [images.length, isControlled, onIndexChange],
  );

  const goPrev = () => setIdx(idx - 1);
  const goNext = () => setIdx(idx + 1);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handler);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx]);

  if (!open || typeof document === "undefined") return null;

  const total = images.length;
  const current = images[idx];
  if (!current) return null;
  const hasMany = total > 1;

  return createPortal(
    <div
      className={LB_BACKDROP_CLASS}
      role="dialog"
      aria-modal="true"
      aria-label="이미지 확대 보기"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {hasMany && (
        <span className={LB_COUNTER_CLASS}>
          {idx + 1} / {total}
        </span>
      )}
      <button type="button" className={LB_CLOSE_CLASS} aria-label="닫기" onClick={onClose}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          <path
            d="M4 4l10 10M14 4l-10 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {hasMany && (
        <>
          <button
            type="button"
            className={LB_NAV_CLASS}
            data-side="prev"
            aria-label="이전 이미지"
            disabled={idx === 0}
            onClick={goPrev}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M11 4L5 9l6 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={LB_NAV_CLASS}
            data-side="next"
            aria-label="다음 이미지"
            disabled={idx === total - 1}
            onClick={goNext}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path
                d="M7 4l6 5-6 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </>
      )}
      <img className={LB_IMG_CLASS} src={current.src} alt={current.alt ?? ""} />
      {current.caption && <p className={LB_CAPTION_CLASS}>{current.caption}</p>}
    </div>,
    document.body,
  );
};

Lightbox.displayName = "Lightbox";
