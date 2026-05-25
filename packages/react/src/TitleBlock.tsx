import React from "react";
import { typeScale } from "@nudge-eap/tokens";

/**
 * TitleBlock — 헤딩 + 서브타이틀 표준 블록.
 *
 * Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반.
 * `level` 하나로 헤딩 폰트 + Gap/Title 토큰이 자동 적용되어
 * level↔gap 미스매치(예: h4 헤딩에 12px gap)를 원천 차단한다.
 *
 * 서브타이틀이 없으면 단독 헤딩으로 동작한다.
 */

/* ─── Class names ─── */

const TB_CLASS = "nds-title-block";
const TB_TITLE_CLASS = `${TB_CLASS}__title`;
const TB_SUBTITLE_CLASS = `${TB_CLASS}__subtitle`;

/* ─── Level → 폰트 매핑 (Figma 859:5714 Mapping Table) ─── */

const LEVEL_CONFIG = {
  h1: { title: typeScale.headline1, subtitle: typeScale.body3, gapVar: "--gap-title-h1" },
  h2: { title: typeScale.headline2, subtitle: typeScale.body3, gapVar: "--gap-title-h2" },
  h3: { title: typeScale.headline3, subtitle: typeScale.body3, gapVar: "--gap-title-h3" },
  h4: { title: typeScale.headline4, subtitle: typeScale.caption1, gapVar: "--gap-title-h4" },
  h5: { title: typeScale.headline5, subtitle: typeScale.caption1, gapVar: "--gap-title-h5" },
} as const;

export type TitleBlockLevel = keyof typeof LEVEL_CONFIG;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface TitleBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 헤딩 위계 — 폰트와 Gap 이 자동 결정됨 */
  level: TitleBlockLevel;
  /** 헤딩 텍스트 */
  title: React.ReactNode;
  /** 서브타이틀 (선택) */
  subtitle?: React.ReactNode;
}

export const TitleBlock = React.forwardRef<HTMLDivElement, TitleBlockProps>(
  ({ level, title, subtitle, className, style, ...rest }, ref) => {
    const config = LEVEL_CONFIG[level];
    const Heading = level as keyof React.JSX.IntrinsicElements;

    return (
      <div
        ref={ref}
        data-slot="root"
        data-level={level}
        className={cx(TB_CLASS, className)}
        style={{ gap: `var(${config.gapVar})`, ...style }}
        {...rest}
      >
        <Heading
          data-slot="title"
          className={TB_TITLE_CLASS}
          style={{
            fontSize: `${config.title.fontSize}px`,
            lineHeight: `${config.title.lineHeight}px`,
          }}
        >
          {title}
        </Heading>
        {subtitle != null && subtitle !== "" && (
          <p
            data-slot="subtitle"
            className={TB_SUBTITLE_CLASS}
            style={{
              fontSize: `${config.subtitle.fontSize}px`,
              lineHeight: `${config.subtitle.lineHeight}px`,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  },
);

TitleBlock.displayName = "TitleBlock";
