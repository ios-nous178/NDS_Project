/**
 * Public API — class export only (side-effect 등록은 ./runtime 에서).
 *
 * 사용 패턴:
 *   import "@nudge-design/html/runtime";          // 자동 등록 (권장)
 *   import { NdsButton } from "@nudge-design/html"; // 클래스 직접 참조 / 수동 등록
 */

export { NdsElement, define } from "./base/nds-element.js";

export { NdsButton } from "./components/nds-button.js";
export type { ButtonColor, ButtonSize, ButtonVariant } from "./components/nds-button.styles.js";

export { NdsAddButton } from "./components/nds-add-button.js";

export { NdsBrandLogo } from "./components/nds-brand-logo.js";
export type { BrandLogoBrand } from "./components/nds-brand-logo.js";

export { NdsIconButton } from "./components/nds-icon-button.js";
export type { IconButtonSize } from "./components/nds-icon-button.js";

export { NdsAvatar } from "./components/nds-avatar.js";
export type { AvatarShape, AvatarSize } from "./components/nds-avatar.js";

export { NdsBadge } from "./components/nds-badge.js";
export type { BadgeColor, BadgeShape, BadgeSize, BadgeVariant } from "./components/nds-badge.js";

export { NdsValidationChip } from "./components/nds-validation-chip.js";
export type { ValidationChipState } from "./components/nds-validation-chip.js";

export { NdsBanner } from "./components/nds-banner.js";
export type { BannerVariant } from "./components/nds-banner.js";

export { NdsNoticeAlert } from "./components/nds-notice-alert.js";
export type { NoticeAlertVariant } from "./components/nds-notice-alert.js";

export { NdsBreadcrumb, NdsBreadcrumbItem } from "./components/nds-breadcrumb.js";

export { NdsChip } from "./components/nds-chip.js";
export type { ChipColor, ChipSize, ChipVariant } from "./components/nds-chip.js";

export { NdsCircularProgress } from "./components/nds-circular-progress.js";

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

export { NdsReviewCard } from "./components/nds-review-card.js";

export {
  NdsHeader,
  NdsHeaderMainBar,
  NdsHeaderNavBar,
  NdsHeaderLogo,
  NdsHeaderSearch,
  NdsHeaderMenu,
  NdsHeaderMenuItem,
  NdsHeaderActions,
  NdsHeaderAuthButton,
} from "./components/nds-header.js";
export type { HeaderVariant, HeaderPosition } from "./components/nds-header.js";

export {
  NdsFooterInfo,
  NdsFooterTabBar,
  NdsFooterTabItem,
  NdsFooterCompanyInfo,
  NdsFooterWeb,
  NdsFooterWebRow,
  NdsFooterWebSection,
} from "./components/nds-footer.js";
export type { FooterVariant, FooterWebTone } from "./components/nds-footer.js";

export {
  NdsBrandHeader,
  NdsBrandFooter,
  NdsBrandBottomNav,
} from "./components/nds-brand-chrome.js";

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

export { NdsDrawer } from "./components/nds-drawer.js";
export type { DrawerSide, DrawerSize } from "./components/nds-drawer.js";

export { NdsDropdownMenu } from "./components/nds-dropdown-menu.js";
export type { DropdownMenuItem, DropdownMenuGroup } from "./components/nds-dropdown-menu.js";

export { NdsCarousel } from "./components/nds-carousel.js";

export { NdsFormField } from "./components/nds-form-field.js";
export { NdsFormSection } from "./components/nds-form-section.js";

export { NdsModal } from "./components/nds-modal.js";

export { NdsSelect, NdsSelectOption } from "./components/nds-select.js";
export { NdsMultiSelect } from "./components/nds-multi-select.js";
export { NdsCheckboxTree } from "./components/nds-checkbox-tree.js";
export { NdsCheckboxGroup } from "./components/nds-checkbox-group.js";

export { NdsToast } from "./components/nds-toast.js";

export { NdsSnackbar } from "./components/nds-snackbar.js";
export { NdsSnackbarHost } from "./components/nds-snackbar-host.js";

export { NdsToggle } from "./components/nds-toggle.js";
export type { ToggleSize } from "./components/nds-toggle.js";

export { NdsTooltip } from "./components/nds-tooltip.js";
export type { TooltipPlacement } from "./components/nds-tooltip.js";

export { NdsConfirmTooltip } from "./components/nds-confirm-tooltip.js";
export type {
  ConfirmTooltipPlacement,
  ConfirmTooltipActions,
} from "./components/nds-confirm-tooltip.js";

export { NdsProgressBar } from "./components/nds-progress-bar.js";
export type { ProgressBarSize } from "./components/nds-progress-bar.js";

export { NdsSkeleton } from "./components/nds-skeleton.js";
export type { SkeletonVariant } from "./components/nds-skeleton.js";

export { NdsTitleGroup } from "./components/nds-title-group.js";
export type { TitleGroupLevel } from "./components/nds-title-group.js";

export { NdsAvatarGroup } from "./components/nds-avatar-group.js";

export { NdsSearchInput } from "./components/nds-search-input.js";

export { NdsStarRating } from "./components/nds-star-rating.js";

export { NdsNumberStepper } from "./components/nds-number-stepper.js";
export type { NumberStepperSize } from "./components/nds-number-stepper.js";

// 누락 회귀: React Stepper 는 export 돼 있으나 html 미러가 index 에서 빠져 define() 부작용이
// 실행 안 돼 customElements 에 미등록 → <nds-stepper> 가 높이 0 으로 안 보였음(목업 폼 스텝퍼).
export { NdsStepper } from "./components/nds-stepper.js";
export type { StepperVariant } from "./components/nds-stepper.js";

export { NdsSlider } from "./components/nds-slider.js";

export { NdsActionChip } from "./components/nds-action-chip.js";

export {
  NdsSelectedItemsPanel,
  NdsSelectedItemRow,
  NdsRegionRow,
} from "./components/nds-selected-items-panel.js";

export { NdsChart } from "./components/nds-chart.js";

export { NdsCountdownTimer } from "./components/nds-countdown-timer.js";
export type { CountdownFormat } from "./components/nds-countdown-timer.js";

export { NdsExpandableText } from "./components/nds-expandable-text.js";

export { NdsOrderSummaryCard } from "./components/nds-order-summary-card.js";

export { NdsChatBubble } from "./components/nds-chat-bubble.js";
export type { ChatRole, ChatGroupPosition } from "./components/nds-chat-bubble.js";

export { NdsContentViewer } from "./components/nds-content-viewer.js";

export { NdsQuickActionGrid } from "./components/nds-quick-action-grid.js";
export { NdsQuickMenu } from "./components/nds-quick-menu.js";

export { NdsLikertScale } from "./components/nds-likert-scale.js";

export { NdsAmountInput } from "./components/nds-amount-input.js";

export { NdsVerificationCodeInput } from "./components/nds-verification-code-input.js";

export { NdsAddressPicker } from "./components/nds-address-picker.js";

export {
  NdsAccordion,
  NdsAccordionItem,
  NdsAccordionTrigger,
  NdsAccordionContent,
} from "./components/nds-accordion.js";

export { NdsTimeline } from "./components/nds-timeline.js";
export type { TimelineStatus, TimelineMode, TimelineDirection } from "./components/nds-timeline.js";

export { NdsAppointmentCard } from "./components/nds-appointment-card.js";
export type { AppointmentStatus, AppointmentMode } from "./components/nds-appointment-card.js";

export { NdsAttachmentItem } from "./components/nds-attachment-item.js";
export type { AttachmentFileType, AttachmentStatus } from "./components/nds-attachment-item.js";

export { NdsAudioPlayer } from "./components/nds-audio-player.js";

export { NdsAutocomplete } from "./components/nds-autocomplete.js";
export type { AutocompleteOption } from "./components/nds-autocomplete.js";

export { NdsFab } from "./components/nds-fab.js";
export type { FABSize, FABColor, FABPosition } from "./components/nds-fab.js";

export { NdsPriceTag } from "./components/nds-price-tag.js";
export type { PriceTagSize } from "./components/nds-price-tag.js";

export { NdsCounselorCard } from "./components/nds-counselor-card.js";

export { NdsNotificationItem } from "./components/nds-notification-item.js";
export type { NotificationKind } from "./components/nds-notification-item.js";

export { NdsPageHeader } from "./components/nds-page-header.js";

export { NdsUserCard } from "./components/nds-user-card.js";
export type { UserCardLayout } from "./components/nds-user-card.js";

export { NdsFloatingCtaBanner } from "./components/nds-floating-cta-banner.js";
export type { FloatingCtaBannerSize } from "./components/nds-floating-cta-banner.js";

export { NdsTagInput } from "./components/nds-tag-input.js";

export { NdsBottomSheet } from "./components/nds-bottom-sheet.js";

export { NdsCommentItem } from "./components/nds-comment-item.js";

export { NdsLikeButton } from "./components/nds-like-button.js";
export type { LikeButtonSize } from "./components/nds-like-button.js";

export { NdsMediaCard } from "./components/nds-media-card.js";

export { NdsScoreGauge } from "./components/nds-score-gauge.js";
export type { GaugeLevel } from "./components/nds-score-gauge.js";

export { NdsSelectionCard, NdsSelectionCardItem } from "./components/nds-selection-card.js";
export type { SelectionCardMode, SelectionCardLayout } from "./components/nds-selection-card.js";
export { NdsSelectionButton } from "./components/nds-selection-button.js";
export { NdsSelectionButtonGroup } from "./components/nds-selection-button-group.js";

export { NdsFilterBar } from "./components/nds-filter-bar.js";

export { NdsTimeSlotPicker } from "./components/nds-time-slot-picker.js";

export { NdsPhoneInput } from "./components/nds-phone-input.js";

export { NdsPinPad } from "./components/nds-pin-pad.js";

export { NdsProductCard } from "./components/nds-product-card.js";
export type { ProductCardSize } from "./components/nds-product-card.js";

export { NdsPopularPosts } from "./components/nds-popular-posts.js";

export { NdsTrendingKeywords } from "./components/nds-trending-keywords.js";
export type { TrendingTrend } from "./components/nds-trending-keywords.js";

export { NdsFieldActionRow } from "./components/nds-field-action-row.js";

export { NdsTimePicker } from "./components/nds-time-picker.js";

export { NdsMediaThumbnail } from "./components/nds-media-thumbnail.js";
export type { MediaRounded, MediaFit } from "./components/nds-media-thumbnail.js";

export { NdsCalendar } from "./components/nds-calendar.js";

export { NdsCallControlBar } from "./components/nds-call-control-bar.js";

export { NdsChatComposer } from "./components/nds-chat-composer.js";

export { NdsConfetti } from "./components/nds-confetti.js";

export { NdsDataTable } from "./components/nds-data-table.js";
export type { DataTableSortDirection } from "./components/nds-data-table.js";

export { NdsStatsTable } from "./components/nds-stats-table.js";

export { NdsDatePicker } from "./components/nds-date-picker.js";

export { NdsDateRangePicker } from "./components/nds-date-range-picker.js";

export { NdsDsHighlight } from "./components/nds-ds-highlight.js";
export type { DSHighlightMode } from "./components/nds-ds-highlight.js";

export { NdsFileUpload } from "./components/nds-file-upload.js";

export { NdsImageCropper } from "./components/nds-image-cropper.js";

export { NdsImageUpload } from "./components/nds-image-upload.js";

export { NdsLightbox } from "./components/nds-lightbox.js";

export { NdsMultiStepForm } from "./components/nds-multi-step-form.js";

export { NdsPullToRefresh } from "./components/nds-pull-to-refresh.js";

export { NdsSidebar } from "./components/nds-sidebar.js";

export { NdsSignaturePad } from "./components/nds-signature-pad.js";

export { NdsVideoPlayer } from "./components/nds-video-player.js";

export { NdsVoiceRecorder } from "./components/nds-voice-recorder.js";

export { NdsWaveformPlayer } from "./components/nds-waveform-player.js";

export { NdsInspector } from "./components/nds-inspector.js";

// react↔html export parity 복원 — 이 컴포넌트들은 runtime.ts 에는 등록돼 있으나
// index 배럴에서 빠져 있었다(NdsStepper 회귀와 동일 계열).
export { NdsCoachMark } from "./components/nds-coach-mark.js";
export type { CoachMarkPlacement } from "./components/nds-coach-mark.js";

export { NdsEmptyState } from "./components/nds-empty-state.js";

export { NdsOnlineIndicator } from "./components/nds-online-indicator.js";
export type { PresenceStatus } from "./components/nds-online-indicator.js";

export { NdsPagination } from "./components/nds-pagination.js";

export { NdsPopup } from "./components/nds-popup.js";

export { NdsSparkline } from "./components/nds-sparkline.js";
export type { SparklineKind } from "./components/nds-sparkline.js";

export { NdsTextButton } from "./components/nds-text-button.js";
export type { TextButtonSize } from "./components/nds-text-button.js";
