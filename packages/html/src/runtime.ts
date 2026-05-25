/**
 * Side-effect entry: import 만으로 모든 nds-* custom elements 가 등록된다.
 *
 *   import "@nudge-eap/html/runtime";
 *
 * Astro / plain HTML / React 어디서든 한 번 import 하면 끝.
 * 각 컴포넌트 파일은 자기 자신의 define() 을 모듈 톱레벨에서 호출하므로
 * 별도 register 호출이 필요 없다.
 */

import "./components/nds-button.js";
import "./components/nds-icon-button.js";
import "./components/nds-avatar.js";
import "./components/nds-badge.js";
import "./components/nds-chip.js";
import "./components/nds-checkbox.js";
import "./components/nds-radio.js";
import "./components/nds-card.js";
import "./components/nds-list.js";
import "./components/nds-divider.js";
import "./components/nds-spinner.js";
import "./components/nds-textarea.js";
import "./components/nds-input.js";
import "./components/nds-tabs.js";
import "./components/nds-modal.js";
import "./components/nds-select.js";
import "./components/nds-toggle.js";
import "./components/nds-progress-bar.js";
import "./components/nds-skeleton.js";
