/**
 * Public API — class export only (side-effect 등록은 ./runtime 에서).
 *
 * 사용 패턴:
 *   import "@nudge-eap/html/runtime";          // 자동 등록 (권장)
 *   import { NdsButton } from "@nudge-eap/html"; // 클래스 직접 참조 / 수동 등록
 */

export { NdsElement, define } from "./base/nds-element.js";

export { NdsButton } from "./components/nds-button.js";
export type { ButtonColor, ButtonSize, ButtonVariant } from "./components/nds-button.styles.js";

export { NdsIconButton } from "./components/nds-icon-button.js";
export type { IconButtonSize } from "./components/nds-icon-button.js";

export { NdsAvatar } from "./components/nds-avatar.js";
export type { AvatarSize } from "./components/nds-avatar.js";

export { NdsBadge } from "./components/nds-badge.js";
export type { BadgeColor, BadgeSize, BadgeVariant } from "./components/nds-badge.js";

export { NdsChip } from "./components/nds-chip.js";
export type { ChipColor, ChipSize, ChipVariant } from "./components/nds-chip.js";

export { NdsCheckbox } from "./components/nds-checkbox.js";

export { NdsRadio } from "./components/nds-radio.js";

export {
  NdsCard,
  NdsCardHeader,
  NdsCardBody,
  NdsCardFooter,
  NdsCardThumbnail,
} from "./components/nds-card.js";
export type { CardVariant } from "./components/nds-card.js";

export { NdsList, NdsListItem } from "./components/nds-list.js";
export type { ListItemSize, ListVariant } from "./components/nds-list.js";

export { NdsDivider } from "./components/nds-divider.js";
export type { DividerOrientation } from "./components/nds-divider.js";

export { NdsSpinner } from "./components/nds-spinner.js";
export type { SpinnerSize } from "./components/nds-spinner.js";

export { NdsTextarea } from "./components/nds-textarea.js";

export { NdsInput } from "./components/nds-input.js";
export type { InputSize } from "./components/nds-input.js";

export { NdsTabs, NdsTabsList, NdsTabsTrigger, NdsTabsPanel } from "./components/nds-tabs.js";
export type { TabsSize, TabsTone, TabsVariant } from "./components/nds-tabs.js";

export { NdsModal } from "./components/nds-modal.js";

export { NdsSelect, NdsSelectOption } from "./components/nds-select.js";

export { NdsToggle } from "./components/nds-toggle.js";
export type { ToggleSize } from "./components/nds-toggle.js";

export { NdsProgressBar } from "./components/nds-progress-bar.js";
export type { ProgressBarSize } from "./components/nds-progress-bar.js";

export { NdsSkeleton } from "./components/nds-skeleton.js";
export type { SkeletonVariant } from "./components/nds-skeleton.js";

export { NdsTitleBlock } from "./components/nds-title-block.js";
export type { TitleBlockLevel } from "./components/nds-title-block.js";

export { NdsAvatarGroup } from "./components/nds-avatar-group.js";

export { NdsSegmented } from "./components/nds-segmented.js";
export type { SegmentedSize } from "./components/nds-segmented.js";

export { NdsActionChip } from "./components/nds-action-chip.js";

export { NdsCountdownTimer } from "./components/nds-countdown-timer.js";
export type { CountdownFormat } from "./components/nds-countdown-timer.js";

export { NdsExpandableText } from "./components/nds-expandable-text.js";

export { NdsCardVisual } from "./components/nds-card-visual.js";
export type { CardVisualBrand } from "./components/nds-card-visual.js";

export { NdsOrderSummaryCard } from "./components/nds-order-summary-card.js";

export { NdsStreakCard } from "./components/nds-streak-card.js";

export { NdsChatBubble } from "./components/nds-chat-bubble.js";
export type { ChatRole, ChatGroupPosition } from "./components/nds-chat-bubble.js";

export { NdsJournalEntry } from "./components/nds-journal-entry.js";

export { NdsContentViewer } from "./components/nds-content-viewer.js";

export { NdsBreathingGuide } from "./components/nds-breathing-guide.js";
export type { BreathingPhaseKind } from "./components/nds-breathing-guide.js";

export { NdsQuickActionGrid } from "./components/nds-quick-action-grid.js";

export { NdsLikertScale } from "./components/nds-likert-scale.js";
