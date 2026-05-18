import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  cv,
  fontFamily,
  fontWeight,
  radius,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Constants ─── */

const SS_CLASS = "nds-share-sheet";
const SS_BACKDROP_CLASS = `${SS_CLASS}__backdrop`;
const SS_PANEL_CLASS = `${SS_CLASS}__panel`;
const SS_HEADER_CLASS = `${SS_CLASS}__header`;
const SS_TITLE_CLASS = `${SS_CLASS}__title`;
const SS_DESC_CLASS = `${SS_CLASS}__desc`;
const SS_GRID_CLASS = `${SS_CLASS}__grid`;
const SS_ITEM_CLASS = `${SS_CLASS}__item`;
const SS_ICON_CLASS = `${SS_CLASS}__icon`;
const SS_LABEL_CLASS = `${SS_CLASS}__label`;
const SS_LINK_CLASS = `${SS_CLASS}__link`;
const SS_LINK_INPUT_CLASS = `${SS_CLASS}__link-input`;
const SS_COPY_BTN_CLASS = `${SS_CLASS}__copy-btn`;

/* ─── Types ─── */

export interface ShareTarget {
  /** 고유 키 */
  key: string;
  /** 라벨 */
  label: string;
  /** 아이콘/이모지 */
  icon: React.ReactNode;
  /** 클릭 콜백 */
  onClick: () => void;
  /** 아이콘 배경색 */
  bg?: string;
}

export interface ShareSheetProps {
  /** 열림 여부 */
  open: boolean;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 제목 */
  title?: React.ReactNode;
  /** 설명 */
  description?: React.ReactNode;
  /** 공유 대상 목록 */
  targets: ShareTarget[];
  /** 링크 (지정 시 하단에 복사 가능한 인풋) */
  link?: string;
  /** 링크 복사 후 라벨 변경용 */
  copiedLabel?: string;
  /** 링크 복사 콜백 (외부 토스트 등) */
  onLinkCopied?: () => void;
}

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const ssStyles = `
  :where(.${SS_BACKDROP_CLASS}) {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    animation: nds-share-fade 200ms ease;
    font-family: ${fontFamily.web};
  }

  @keyframes nds-share-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  :where(.${SS_PANEL_CLASS}) {
    width: 100%;
    max-width: 480px;
    background: ${cv.surface.default};
    border-radius: ${radius.lg}px ${radius.lg}px 0 0;
    padding: ${spacing[24]}px ${spacing[20]}px ${spacing[20]}px;
    box-sizing: border-box;
    animation: nds-share-slide 240ms ease;
  }

  @keyframes nds-share-slide {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  :where(.${SS_HEADER_CLASS}) {
    display: flex;
    flex-direction: column;
    gap: ${spacing[4]}px;
    margin-bottom: ${spacing[20]}px;
  }

  :where(.${SS_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.bold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${SS_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    color: ${cv.textRole.subtle};
    margin: 0;
  }

  :where(.${SS_GRID_CLASS}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${spacing[12]}px;
  }

  :where(.${SS_ITEM_CLASS}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${spacing[8]}px;
    padding: ${spacing[8]}px;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: ${radius.md}px;
    transition: background-color ${transition.default};
    font-family: inherit;
  }

  :where(.${SS_ITEM_CLASS}:hover) { background: ${cv.surface.section}; }

  :where(.${SS_ICON_CLASS}) {
    width: 48px;
    height: 48px;
    border-radius: 9999px;
    background: var(--nds-share-icon-bg, ${cv.surface.section});
    color: ${cv.textRole.normal};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
  }

  :where(.${SS_LABEL_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.normal};
    text-align: center;
  }

  :where(.${SS_LINK_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    margin-top: ${spacing[16]}px;
    padding: ${spacing[8]}px ${spacing[12]}px;
    background: ${cv.surface.section};
    border-radius: ${radius.md}px;
  }

  :where(.${SS_LINK_INPUT_CLASS}) {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    color: ${cv.textRole.normal};
    min-width: 0;
  }

  :where(.${SS_COPY_BTN_CLASS}) {
    height: 32px;
    padding: 0 ${spacing[12]}px;
    border: none;
    border-radius: 9999px;
    background: ${cv.textRole.normal};
    color: ${cv.surface.default};
    cursor: pointer;
    font-family: inherit;
    font-size: ${typeScale.caption1.fontSize}px;
    font-weight: ${fontWeight.semibold};
    flex-shrink: 0;
  }
`;

/* ─── Component ─── */

export const ShareSheet: React.FC<ShareSheetProps> = ({
  open,
  onClose,
  title = "공유하기",
  description,
  targets,
  link,
  copiedLabel = "복사됨",
  onLinkCopied,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      onLinkCopied?.();
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={SS_BACKDROP_CLASS}
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === "string" ? title : "공유"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={SS_PANEL_CLASS}>
        <div className={SS_HEADER_CLASS}>
          {title && <h3 className={SS_TITLE_CLASS}>{title}</h3>}
          {description && <p className={SS_DESC_CLASS}>{description}</p>}
        </div>
        <div className={SS_GRID_CLASS}>
          {targets.map((t) => (
            <button
              key={t.key}
              type="button"
              className={SS_ITEM_CLASS}
              onClick={() => {
                t.onClick();
                onClose();
              }}
            >
              <span
                className={SS_ICON_CLASS}
                aria-hidden
                style={t.bg ? ({ "--nds-share-icon-bg": t.bg } as React.CSSProperties) : undefined}
              >
                {t.icon}
              </span>
              <span className={SS_LABEL_CLASS}>{t.label}</span>
            </button>
          ))}
        </div>
        {link && (
          <div className={SS_LINK_CLASS}>
            <input className={SS_LINK_INPUT_CLASS} value={link} readOnly aria-label="공유 링크" />
            <button type="button" className={SS_COPY_BTN_CLASS} onClick={handleCopy}>
              {copied ? copiedLabel : "복사"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

ShareSheet.displayName = "ShareSheet";
