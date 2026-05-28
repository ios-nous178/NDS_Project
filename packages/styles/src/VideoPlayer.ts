/* Auto-generated from packages/react/src/VideoPlayer.tsx during the @nudge-design/styles split. */
import { cv, fontFamily, fontWeight, radius, transition, typeScale } from "@nudge-design/tokens";

const VP_CLASS = "nds-video-player";
const VP_VIDEO_CLASS = `${VP_CLASS}__video`;
const VP_POSTER_CLASS = `${VP_CLASS}__poster`;
const VP_OVERLAY_CLASS = `${VP_CLASS}__overlay`;
const VP_PLAY_BTN_CLASS = `${VP_CLASS}__play-btn`;
const VP_TITLE_CLASS = `${VP_CLASS}__title`;
const VP_DURATION_CLASS = `${VP_CLASS}__duration`;
const VP_CONTROLS_CLASS = `${VP_CLASS}__controls`;
const VP_TRACK_CLASS = `${VP_CLASS}__track`;
const VP_FILL_CLASS = `${VP_CLASS}__fill`;
const VP_INPUT_CLASS = `${VP_CLASS}__input`;
const VP_BTN_CLASS = `${VP_CLASS}__btn`;

export const videoPlayerStyles = `
  :where(.${VP_CLASS}) {
    position: relative;
    width: 100%;
    border-radius: var(--nds-video-player-radius, ${radius.lg}px);
    overflow: hidden;
    background: #000;
    font-family: ${fontFamily.web};
    aspect-ratio: var(--nds-video-player-aspect, 16 / 9);
  }

  :where(.${VP_VIDEO_CLASS}) {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  :where(.${VP_POSTER_CLASS}) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  :where(.${VP_OVERLAY_CLASS}) {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: var(--inset-card);
    color: #fff;
    background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%);
    pointer-events: none;
  }

  :where(.${VP_OVERLAY_CLASS}[data-hide="true"]) {
    opacity: 0;
    transition: opacity ${transition.default};
  }

  :where(.${VP_OVERLAY_CLASS} > *) { pointer-events: auto; }

  :where(.${VP_TITLE_CLASS}) {
    font-size: ${typeScale.body2.fontSize}px;
    line-height: ${typeScale.body2.lineHeight}px;
    font-weight: ${fontWeight.semibold};
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
    margin: 0;
  }

  :where(.${VP_DURATION_CLASS}) {
    align-self: flex-end;
    font-size: 12px;
    line-height: 16px;
    background: rgba(0,0,0,0.55);
    padding: 4px var(--inset-chip);
    border-radius: ${radius.sm}px;
    font-weight: ${fontWeight.medium};
  }

  :where(.${VP_PLAY_BTN_CLASS}) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.92);
    color: #111;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: transform ${transition.default}, background-color ${transition.default};
  }

  :where(.${VP_PLAY_BTN_CLASS}:hover) {
    transform: translate(-50%, -50%) scale(1.05);
  }

  :where(.${VP_PLAY_BTN_CLASS}:focus-visible) {
    outline: 3px solid ${cv.borderRole.brand};
    outline-offset: 2px;
  }

  :where(.${VP_CONTROLS_CLASS}) {
    display: flex;
    align-items: center;
    gap: var(--gap-default);
    width: 100%;
  }

  :where(.${VP_BTN_CLASS}) {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #fff;
    cursor: pointer;
    border-radius: 9999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  :where(.${VP_BTN_CLASS}:hover) {
    background: rgba(255, 255, 255, 0.18);
  }

  :where(.${VP_TRACK_CLASS}) {
    flex: 1;
    position: relative;
    height: 4px;
    background: rgba(255, 255, 255, 0.32);
    border-radius: 9999px;
  }

  :where(.${VP_FILL_CLASS}) {
    position: absolute;
    inset: 0;
    width: var(--nds-video-fill, 0%);
    background: #fff;
    border-radius: 9999px;
  }

  :where(.${VP_INPUT_CLASS}) {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;
