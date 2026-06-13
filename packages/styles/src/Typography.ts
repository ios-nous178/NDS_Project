/* Shared typography class layer — DS 의 첫 공용 타이포 SSOT.
 * 타입 스케일(size+line-height)·시맨틱 색(tone)·weight 를 임의의 텍스트에 거는
 * 클래스 한 벌. <Text>(react) 와 <nds-text>(html) 가 둘 다 이 클래스를 소비하고,
 * 다른 컴포넌트(Heading 등)도 `${typeScale.X.fontSize}px` 인라인 대신 재사용한다.
 *
 * 클래스:
 *   .nds-text                  base (font-family, margin 0, weight regular)
 *   .nds-text-{scale}          size + line-height   (display1 … label)
 *   .nds-text-tone-{role}      시맨틱 색            (strong … status-info)
 *   .nds-text-weight-{name}    font-weight override (regular … bold)
 *   .nds-text[data-clamped]    -webkit-line-clamp (var --nds-text-max-lines)
 *   .nds-text-expandable / .nds-text__toggle   '더보기/접기' compose (Text expandable=)
 *
 * 스케일 클래스는 .nds-text base 없이도 독립 사용 가능(Heading 이 size 만 빌려 씀).
 */
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-design/tokens";

export const typographyStyles = `
  :where(.nds-text) {
    font-family: ${fontFamily.web};
    margin: 0;
    font-weight: ${fontWeight.regular};
  }

  /* ── scale: font-size + line-height ── */
  :where(.nds-text-display1) { font-size: ${typeScale.display1.fontSize}px; line-height: ${typeScale.display1.lineHeight}px; }
  :where(.nds-text-display2) { font-size: ${typeScale.display2.fontSize}px; line-height: ${typeScale.display2.lineHeight}px; }
  :where(.nds-text-display3) { font-size: ${typeScale.display3.fontSize}px; line-height: ${typeScale.display3.lineHeight}px; }
  :where(.nds-text-headline1) { font-size: ${typeScale.headline1.fontSize}px; line-height: ${typeScale.headline1.lineHeight}px; }
  :where(.nds-text-headline2) { font-size: ${typeScale.headline2.fontSize}px; line-height: ${typeScale.headline2.lineHeight}px; }
  :where(.nds-text-headline3) { font-size: ${typeScale.headline3.fontSize}px; line-height: ${typeScale.headline3.lineHeight}px; }
  :where(.nds-text-headline4) { font-size: ${typeScale.headline4.fontSize}px; line-height: ${typeScale.headline4.lineHeight}px; }
  :where(.nds-text-headline5) { font-size: ${typeScale.headline5.fontSize}px; line-height: ${typeScale.headline5.lineHeight}px; }
  :where(.nds-text-body1) { font-size: ${typeScale.body1.fontSize}px; line-height: ${typeScale.body1.lineHeight}px; }
  :where(.nds-text-body2) { font-size: ${typeScale.body2.fontSize}px; line-height: ${typeScale.body2.lineHeight}px; }
  :where(.nds-text-body3) { font-size: ${typeScale.body3.fontSize}px; line-height: ${typeScale.body3.lineHeight}px; }
  :where(.nds-text-caption1) { font-size: ${typeScale.caption1.fontSize}px; line-height: ${typeScale.caption1.lineHeight}px; }
  :where(.nds-text-caption2) { font-size: ${typeScale.caption2.fontSize}px; line-height: ${typeScale.caption2.lineHeight}px; }
  :where(.nds-text-label) { font-size: ${typeScale.label.fontSize}px; line-height: ${typeScale.label.lineHeight}px; }

  /* ── tone: 시맨틱 색 ── */
  :where(.nds-text-tone-strong) { color: ${cv.textRole.strong}; }
  :where(.nds-text-tone-normal) { color: ${cv.textRole.normal}; }
  :where(.nds-text-tone-subtle) { color: ${cv.textRole.subtle}; }
  :where(.nds-text-tone-muted) { color: ${cv.textRole.muted}; }
  :where(.nds-text-tone-disabled) { color: ${cv.textRole.disabled}; }
  :where(.nds-text-tone-inverse) { color: ${cv.textRole.inverse}; }
  :where(.nds-text-tone-brand) { color: ${cv.textRole.brand}; }
  :where(.nds-text-tone-brand-strong) { color: ${cv.textRole.brandStrong}; }
  :where(.nds-text-tone-status-success) { color: ${cv.textRole.statusSuccess}; }
  :where(.nds-text-tone-status-error) { color: ${cv.textRole.statusError}; }
  :where(.nds-text-tone-status-caution) { color: ${cv.textRole.statusCaution}; }
  :where(.nds-text-tone-status-info) { color: ${cv.textRole.statusInfo}; }

  /* ── weight override ── */
  :where(.nds-text-weight-regular) { font-weight: ${fontWeight.regular}; }
  :where(.nds-text-weight-medium) { font-weight: ${fontWeight.medium}; }
  :where(.nds-text-weight-semibold) { font-weight: ${fontWeight.semibold}; }
  :where(.nds-text-weight-bold) { font-weight: ${fontWeight.bold}; }

  /* ── clamp (maxLines) ── */
  :where(.nds-text[data-clamped="true"]) {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--nds-text-max-lines, 1);
    overflow: hidden;
    word-break: break-word;
  }

  /* ── expandable (Text expandable=) — '더보기/접기' compose ── */
  :where(.nds-text-expandable) {
    display: flex;
    flex-direction: column;
    gap: var(--semantic-gap-default);
  }
  :where(.nds-text__toggle) {
    align-self: flex-start;
    border: none;
    background: transparent;
    color: ${cv.textRole.brand};
    font-family: inherit;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.semibold};
    cursor: pointer;
    padding: 0;
    transition: opacity ${transition.default};
  }
  :where(.nds-text__toggle:hover) { opacity: 0.75; }
  :where(.nds-text__toggle:focus-visible) {
    outline: 2px solid ${cv.borderRole.brand};
    outline-offset: 2px;
    border-radius: 4px;
  }
`;
