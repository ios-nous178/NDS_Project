/* Auto-generated from packages/react/src/NotificationItem.tsx during the @nudge-eap/styles split. */
import { cv, fontFamily, fontWeight, spacing, transition, typeScale } from "@nudge-eap/tokens";

const NI_CLASS = "nds-notification-item";
const NI_ICON_CLASS = `${NI_CLASS}__icon`;
const NI_BODY_CLASS = `${NI_CLASS}__body`;
const NI_TITLE_CLASS = `${NI_CLASS}__title`;
const NI_DESC_CLASS = `${NI_CLASS}__desc`;
const NI_TIME_CLASS = `${NI_CLASS}__time`;
const NI_DOT_CLASS = `${NI_CLASS}__dot`;

const KIND_BG = {
  info: "var(--semantic-bg-status-info)",
  success: "var(--semantic-bg-status-success)",
  warning: "var(--semantic-bg-status-caution)",
  error: "var(--semantic-bg-status-error)",
  system: "var(--semantic-bg-section-default)",
};

const KIND_FG = {
  info: "var(--semantic-fill-brand-default)",
  success: "var(--semantic-icon-status-success)",
  warning: "var(--semantic-icon-status-caution)",
  error: "var(--semantic-icon-status-error)",
  system: "var(--semantic-text-subtle-default)",
};

export const niStyles = `
  :where(.${NI_CLASS}) {
    display: flex;
    align-items: flex-start;
    gap: var(--gap-comfortable);
    padding: var(--inset-card);
    background: ${cv.surface.default};
    border-bottom: 1px solid ${cv.borderRole.subtle};
    font-family: ${fontFamily.web};
    transition: background-color ${transition.default};
    box-sizing: border-box;
    position: relative;
  }

  :where(.${NI_CLASS}[data-clickable="true"]) { cursor: pointer; }
  :where(.${NI_CLASS}[data-clickable="true"]:hover) { background: ${cv.surface.section}; }

  :where(.${NI_CLASS}[data-unread="true"]) {
    background: var(--semantic-bg-status-info);
  }

  :where(.${NI_CLASS}[data-unread="true"][data-clickable="true"]:hover) {
    background: var(--semantic-bg-brand-subtle);
  }

  :where(.${NI_DOT_CLASS}) {
    position: absolute;
    top: ${spacing[16]}px;
    left: 4px;
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    background: var(--semantic-fill-status-error);
  }

  :where(.${NI_ICON_CLASS}) {
    width: 36px;
    height: 36px;
    border-radius: 9999px;
    background: var(--nds-noti-icon-bg, ${KIND_BG.info});
    color: var(--nds-noti-icon-fg, ${KIND_FG.info});
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  :where(.${NI_BODY_CLASS}) {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :where(.${NI_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    color: ${cv.textRole.normal};
    margin: 0;
  }

  :where(.${NI_DESC_CLASS}) {
    font-size: ${typeScale.body3.fontSize}px;
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${cv.textRole.subtle};
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  :where(.${NI_TIME_CLASS}) {
    font-size: ${typeScale.caption2.fontSize}px;
    color: ${cv.textRole.subtle};
    margin-top: ${spacing[4]}px;
  }
`;
