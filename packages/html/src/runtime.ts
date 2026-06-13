/**
 * Side-effect entry: import 만으로 모든 nds-* custom elements 가 등록된다.
 *
 *   import "@nudge-design/html/runtime";
 *
 * Astro / plain HTML / React 어디서든 한 번 import 하면 끝.
 * 각 컴포넌트 파일은 자기 자신의 define() 을 모듈 톱레벨에서 호출하므로
 * 별도 register 호출이 필요 없다.
 */

import "./components/nds-button.js";
import "./components/nds-icon-button.js";
import "./components/nds-avatar.js";
import "./components/nds-badge.js";
import "./components/nds-validation-chip.js";
import "./components/nds-banner.js";
import "./components/nds-notice-alert.js";
import "./components/nds-breadcrumb.js";
import "./components/nds-chip.js";
import "./components/nds-checkbox.js";
import "./components/nds-radio.js";
import "./components/nds-card.js";
import "./components/nds-review-card.js";
import "./components/nds-header.js";
import "./components/nds-footer.js";
import "./components/nds-brand-chrome.js";
import "./components/nds-list.js";
import "./components/nds-divider.js";
import "./components/nds-spinner.js";
import "./components/nds-textarea.js";
import "./components/nds-input.js";
import "./components/nds-tabs.js";
import "./components/nds-drawer.js";
import "./components/nds-dropdown-menu.js";
import "./components/nds-carousel.js";
import "./components/nds-form-field.js";
import "./components/nds-form-section.js";
import "./components/nds-input-group.js";
import "./components/nds-modal.js";
import "./components/nds-select.js";
import "./components/nds-toast.js";
import "./components/nds-toggle.js";
import "./components/nds-tooltip.js";
import "./components/nds-confirm-tooltip.js";
import "./components/nds-progress-bar.js";
import "./components/nds-skeleton.js";
import "./components/nds-heading.js";
import "./components/nds-avatar-group.js";
import "./components/nds-search-input.js";
import "./components/nds-star-rating.js";
import "./components/nds-slider.js";
import "./components/nds-action-chip.js";
import "./components/nds-selected-items-panel.js";
import "./components/nds-chart.js";
import "./components/nds-countdown-timer.js";
import "./components/nds-expandable-text.js";
import "./components/nds-order-summary-card.js";
import "./components/nds-chat-bubble.js";
import "./components/nds-content-viewer.js";
import "./components/nds-quick-action-grid.js";
import "./components/nds-quick-menu.js";
import "./components/nds-likert-scale.js";
import "./components/nds-amount-input.js";
import "./components/nds-verification-code-input.js";
import "./components/nds-address-picker.js";
import "./components/nds-accordion.js";
import "./components/nds-timeline.js";
import "./components/nds-attachment-item.js";
import "./components/nds-audio-player.js";
import "./components/nds-autocomplete.js";
import "./components/nds-fab.js";
import "./components/nds-price-tag.js";
import "./components/nds-page-header.js";
import "./components/nds-floating-cta-banner.js";
import "./components/nds-tag-input.js";
import "./components/nds-bottom-sheet.js";
import "./components/nds-comment-item.js";
import "./components/nds-like-button.js";
import "./components/nds-media-card.js";
import "./components/nds-selection-card.js";
import "./components/nds-selection-button.js";
import "./components/nds-selection-button-group.js";
import "./components/nds-filter-bar.js";
import "./components/nds-phone-input.js";
import "./components/nds-product-card.js";
import "./components/nds-popular-posts.js";
import "./components/nds-trending-keywords.js";
import "./components/nds-time-picker.js";
import "./components/nds-media-thumbnail.js";
import "./components/nds-calendar.js";
import "./components/nds-chat-composer.js";
import "./components/nds-data-table.js";
import "./components/nds-stats-table.js";
import "./components/nds-date-picker.js";
import "./components/nds-date-range-picker.js";
import "./components/nds-ds-highlight.js";
import "./components/nds-file-upload.js";
import "./components/nds-image-upload.js";
import "./components/nds-multi-step-form.js";
import "./components/nds-sidebar.js";
import "./components/nds-video-player.js";
import "./components/nds-inspector.js";
import "./components/nds-add-button.js";
import "./components/nds-agreement.js";
import "./components/nds-article.js";
import "./components/nds-multi-select.js";
import "./components/nds-checkbox-tree.js";
import "./components/nds-checkbox-group.js";
// 회귀 방지: 아래 컴포넌트들은 자기 파일에서 define() 하지만 이 side-effect 엔트리에
// import 되지 않아 standalone 번들에 미포함 → <nds-*> 가 런타임 미등록(빈 박스)이었다.
// scripts/check-runtime-registry.mjs 가 define()↔runtime.ts import drift 를 하드 게이트한다.
import "./components/nds-brand-logo.js";
import "./components/nds-empty-state.js";
import "./components/nds-pagination.js";
import "./components/nds-popup.js";
import "./components/nds-snackbar.js";
import "./components/nds-snackbar-host.js";
import "./components/nds-sparkline.js";
import "./components/nds-stepper.js";
import "./components/nds-text-button.js";
