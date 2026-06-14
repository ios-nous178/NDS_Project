import React from "react";

/**
 * Heading — 헤딩 + 보조 설명(description) 표준 블록.
 *
 * Figma TitleGapGuide 859:5614 (6 페이지 58건 실측) 기반.
 * `level` 하나로 헤딩 폰트 + Gap/Title 토큰이 자동 적용되어
 * level↔gap 미스매치(예: h4 헤딩에 12px gap)를 원천 차단한다.
 *
 * description 이 없으면 순수 헤딩으로 동작한다(Chakra/Atlassian 의 Heading 과 동일).
 */

/* ─── Class names ─── */

const HD_CLASS = "nds-heading";
const HD_TITLE_CLASS = `${HD_CLASS}__title`;
const HD_DESCRIPTION_CLASS = `${HD_CLASS}__description`;

/* ─── Level → 폰트 매핑 (Figma 859:5714 Mapping Table) ───
   title/description 의 size+line-height 는 공용 .nds-text-{scale} 클래스로 빌린다
   (인라인 px 제거 → 타이포 SSOT 하나). weight/color 는 .nds-heading__* 가 유지. */

const LEVEL_CONFIG = {
  h1: { title: "headline1", description: "body3", gapVar: "--semantic-gap-title-h1" },
  h2: { title: "headline2", description: "body3", gapVar: "--semantic-gap-title-h2" },
  h3: { title: "headline3", description: "body3", gapVar: "--semantic-gap-title-h3" },
  h4: { title: "headline4", description: "caption1", gapVar: "--semantic-gap-title-h4" },
  h5: { title: "headline5", description: "caption1", gapVar: "--semantic-gap-title-h5" },
} as const;

export type HeadingLevel = keyof typeof LEVEL_CONFIG;
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 헤딩 위계 — 폰트와 Gap 이 자동 결정됨 */
  level: HeadingLevel;
  /**
   * 렌더할 헤딩 태그 override (기본 = level).
   * 비주얼(level 의 폰트·gap)은 그대로 두고 DOM 시맨틱만 바꿔야 할 때 쓴다.
   * 예: 페이지 헤더(pattern:page-header)는 시각적으로 h2 지만 페이지 랜드마크상 h1 이어야 함 → level='h2' as='h1'.
   */
  as?: HeadingLevel;
  /** 헤딩 텍스트 */
  title: React.ReactNode;
  /** 보조 설명 (선택) — 있으면 level 에 맞는 gap 으로 자동 묶인다. */
  description?: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLDivElement, HeadingProps>(
  ({ level, as, title, description, className, style, ...rest }, ref) => {
    const config = LEVEL_CONFIG[level];
    const Tag = (as ?? level) as keyof React.JSX.IntrinsicElements;

    return (
      <div
        ref={ref}
        data-slot="root"
        data-level={level}
        className={cx(HD_CLASS, className)}
        style={{ gap: `var(${config.gapVar})`, ...style }}
        {...rest}
      >
        <Tag data-slot="title" className={cx(HD_TITLE_CLASS, `nds-text-${config.title}`)}>
          {title}
        </Tag>
        {description != null && description !== "" && (
          <p
            data-slot="description"
            className={cx(HD_DESCRIPTION_CLASS, `nds-text-${config.description}`)}
          >
            {description}
          </p>
        )}
      </div>
    );
  },
);

Heading.displayName = "Heading";
