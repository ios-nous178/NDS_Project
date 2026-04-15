import React from "react";
import {
  fontFamily,
  fontWeight,
  radius,
  semantic,
  shadow,
  spacing,
  transition,
  typeScale,
} from "@nudge-eap/tokens";

/* ─── Class names ─── */

const CARD_CLASS = "nds-card";
const CARD_ROOT_CLASS = `${CARD_CLASS}__root`;
const CARD_THUMBNAIL_CLASS = `${CARD_CLASS}__thumbnail`;
const CARD_HEADER_CLASS = `${CARD_CLASS}__header`;
const CARD_BODY_CLASS = `${CARD_CLASS}__body`;
const CARD_FOOTER_CLASS = `${CARD_CLASS}__footer`;
const CARD_TITLE_CLASS = `${CARD_CLASS}__title`;
const CARD_SUBTITLE_CLASS = `${CARD_CLASS}__subtitle`;
const CARD_META_CLASS = `${CARD_CLASS}__meta`;

/* ─── Styles ─── */

// eslint-disable-next-line unused-imports/no-unused-vars
const cardStyles = `
  :where(.${CARD_ROOT_CLASS}) {
    display: flex;
    flex-direction: column;
    width: var(--nds-card-width, 100%);
    font-family: ${fontFamily.web};
    box-sizing: border-box;
    border-radius: var(--nds-card-radius, ${radius.md}px);
    background: var(--nds-card-background, ${semantic.bg.white});
    overflow: hidden;
    transition: background-color ${transition.default}, box-shadow ${transition.default};
  }

  :where(.${CARD_ROOT_CLASS}[data-variant="outlined"]) {
    border: 1px solid ${semantic.border.light};
  }

  :where(.${CARD_ROOT_CLASS}[data-variant="elevated"]) {
    box-shadow: ${shadow.sm};
  }

  :where(.${CARD_ROOT_CLASS}[data-clickable="true"]) {
    cursor: pointer;
  }

  :where(.${CARD_ROOT_CLASS}[data-clickable="true"]:hover) {
    background: var(--nds-card-hover-background, ${semantic.bg.coolGrayLighter});
  }

  :where(.${CARD_THUMBNAIL_CLASS}) {
    position: relative;
    width: 100%;
    aspect-ratio: var(--nds-card-thumbnail-ratio, 16 / 10);
    overflow: hidden;
    background: ${semantic.bg.light};
  }

  :where(.${CARD_THUMBNAIL_CLASS} img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  :where(.${CARD_HEADER_CLASS}) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: ${spacing[8]}px;
    padding: ${spacing[16]}px ${spacing[16]}px 0;
  }

  :where(.${CARD_TITLE_CLASS}) {
    margin: 0;
    font-size: ${typeScale.body1.fontSize}px;
    font-weight: ${fontWeight.bold};
    line-height: ${typeScale.body1.lineHeight}px;
    color: ${semantic.text.default};
  }

  :where(.${CARD_SUBTITLE_CLASS}) {
    margin: ${spacing[4]}px 0 0;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: ${typeScale.body3.lineHeight}px;
    color: ${semantic.text.subtle};
  }

  :where(.${CARD_META_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[4]}px;
    flex-shrink: 0;
    font-size: ${typeScale.body2.fontSize}px;
    font-weight: ${fontWeight.medium};
    line-height: ${typeScale.body2.lineHeight}px;
    color: ${semantic.text.default};
  }

  :where(.${CARD_BODY_CLASS}) {
    padding: ${spacing[12]}px ${spacing[16]}px;
    font-size: ${typeScale.body3.fontSize}px;
    font-weight: ${fontWeight.regular};
    line-height: 1.5;
    color: ${semantic.text.subtle};
  }

  :where(.${CARD_FOOTER_CLASS}) {
    display: flex;
    align-items: center;
    gap: ${spacing[8]}px;
    padding: 0 ${spacing[16]}px ${spacing[16]}px;
    border-top: 1px solid ${semantic.border.light};
    margin-top: auto;
    padding-top: ${spacing[12]}px;
  }

  :where(.${CARD_FOOTER_CLASS}[data-no-border="true"]) {
    border-top: none;
    padding-top: 0;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Types ─── */

export type CardVariant = "outlined" | "elevated" | "flat";

/* ─── Compound: Root ─── */

export interface CardRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 스타일 변형 @default "outlined" */
  variant?: CardVariant;
  /** true이면 호버 시 시각적 피드백 제공 */
  clickable?: boolean;
  /** 카드 내부 콘텐츠 */
  children: React.ReactNode;
}

export const CardRoot: React.FC<CardRootProps> = React.memo(
  ({ variant = "outlined", clickable = false, children, className, style, ...rest }) => (
    <div
      data-slot="root"
      data-variant={variant}
      data-clickable={clickable ? "true" : "false"}
      className={cx(CARD_ROOT_CLASS, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardRoot.displayName = "CardRoot";

/* ─── Compound: Thumbnail ─── */

export interface CardThumbnailProps extends React.HTMLAttributes<HTMLDivElement> {
  /** CSS aspect-ratio 값 (예: "16/9", "4/3") */
  aspectRatio?: string;
  /** 썸네일로 표시할 이미지 등 콘텐츠 */
  children: React.ReactNode;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = React.memo(
  ({ aspectRatio, children, className, style, ...rest }) => (
    <div
      data-slot="thumbnail"
      className={cx(CARD_THUMBNAIL_CLASS, className)}
      style={{
        ...(aspectRatio && ({ "--nds-card-thumbnail-ratio": aspectRatio } as React.CSSProperties)),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardThumbnail.displayName = "CardThumbnail";

/* ─── Compound: Header ─── */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 헤더 영역 콘텐츠 (Title, Subtitle, Meta 등) */
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="header" className={cx(CARD_HEADER_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
CardHeader.displayName = "CardHeader";

/* ─── Compound: Title ─── */

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 카드 제목 텍스트 (`<h3>`으로 렌더링) */
  children: React.ReactNode;
}

export const CardTitle: React.FC<CardTitleProps> = React.memo(
  ({ children, className, ...rest }) => (
    <h3 data-slot="title" className={cx(CARD_TITLE_CLASS, className)} {...rest}>
      {children}
    </h3>
  ),
);
CardTitle.displayName = "CardTitle";

/* ─── Compound: Subtitle ─── */

export interface CardSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** 카드 부제목 텍스트 */
  children: React.ReactNode;
}

export const CardSubtitle: React.FC<CardSubtitleProps> = React.memo(
  ({ children, className, ...rest }) => (
    <p data-slot="subtitle" className={cx(CARD_SUBTITLE_CLASS, className)} {...rest}>
      {children}
    </p>
  ),
);
CardSubtitle.displayName = "CardSubtitle";

/* ─── Compound: Meta ─── */

export interface CardMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 메타 정보 콘텐츠 (날짜, 태그 등 — 헤더 우측에 배치) */
  children: React.ReactNode;
}

export const CardMeta: React.FC<CardMetaProps> = React.memo(({ children, className, ...rest }) => (
  <div data-slot="meta" className={cx(CARD_META_CLASS, className)} {...rest}>
    {children}
  </div>
));
CardMeta.displayName = "CardMeta";

/* ─── Compound: Body ─── */

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 카드 본문 콘텐츠 */
  children: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = React.memo(({ children, className, ...rest }) => (
  <div data-slot="body" className={cx(CARD_BODY_CLASS, className)} {...rest}>
    {children}
  </div>
));
CardBody.displayName = "CardBody";

/* ─── Compound: Footer ─── */

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** true이면 푸터 상단 테두리를 숨김 */
  noBorder?: boolean;
  /** 푸터 콘텐츠 (액션 버튼 등) */
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = React.memo(
  ({ noBorder = false, children, className, ...rest }) => (
    <div
      data-slot="footer"
      data-no-border={noBorder ? "true" : "false"}
      className={cx(CARD_FOOTER_CLASS, className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardFooter.displayName = "CardFooter";

/* ─── Flat API ─── */

export interface CardSlotProps {
  /** 루트 컨테이너 `<div>`에 전달할 추가 props */
  root?: Omit<CardRootProps, "children" | "variant" | "clickable">;
  /** 썸네일 `<div>`에 전달할 추가 props */
  thumbnail?: Omit<CardThumbnailProps, "children">;
  /** 헤더 `<div>`에 전달할 추가 props */
  header?: Omit<CardHeaderProps, "children">;
  /** 타이틀 `<h3>`에 전달할 추가 props */
  title?: Omit<CardTitleProps, "children">;
  /** 서브타이틀 `<p>`에 전달할 추가 props */
  subtitle?: Omit<CardSubtitleProps, "children">;
  /** 메타 `<div>`에 전달할 추가 props */
  meta?: Omit<CardMetaProps, "children">;
  /** 본문 `<div>`에 전달할 추가 props */
  body?: Omit<CardBodyProps, "children">;
  /** 푸터 `<div>`에 전달할 추가 props */
  footer?: Omit<CardFooterProps, "children">;
}

export interface CardProps {
  /** 스타일 변형 */
  variant?: CardVariant;
  /** 클릭 가능 여부 */
  clickable?: boolean;
  /** 썸네일 콘텐츠 (이미지 등) */
  thumbnail?: React.ReactNode;
  /** 썸네일 비율 */
  thumbnailRatio?: string;
  /** 제목 */
  title?: string;
  /** 부제목 */
  subtitle?: string;
  /** 메타 정보 (우상단) */
  meta?: React.ReactNode;
  /** 본문 콘텐츠 */
  children?: React.ReactNode;
  /** 푸터 콘텐츠 */
  footer?: React.ReactNode;
  /** 푸터 테두리 숨김 */
  footerNoBorder?: boolean;
  /** 루트 className */
  className?: string;
  /** 루트 style */
  style?: React.CSSProperties;
  /** 클릭 핸들러 */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** 슬롯 프롭 */
  slotProps?: CardSlotProps;
}

const CardComponent: React.FC<CardProps> = ({
  variant = "outlined",
  clickable = false,
  thumbnail,
  thumbnailRatio,
  title,
  subtitle,
  meta,
  children,
  footer,
  footerNoBorder = false,
  className,
  style,
  onClick,
  slotProps,
}) => (
  <CardRoot
    variant={variant}
    clickable={clickable || !!onClick}
    className={cx(slotProps?.root?.className, className)}
    style={{ ...slotProps?.root?.style, ...style }}
    onClick={onClick}
  >
    {thumbnail && (
      <CardThumbnail
        aspectRatio={thumbnailRatio}
        className={slotProps?.thumbnail?.className}
        style={slotProps?.thumbnail?.style}
      >
        {thumbnail}
      </CardThumbnail>
    )}
    {(title || meta) && (
      <CardHeader className={slotProps?.header?.className} style={slotProps?.header?.style}>
        <div>
          {title && (
            <CardTitle className={slotProps?.title?.className} style={slotProps?.title?.style}>
              {title}
            </CardTitle>
          )}
          {subtitle && (
            <CardSubtitle
              className={slotProps?.subtitle?.className}
              style={slotProps?.subtitle?.style}
            >
              {subtitle}
            </CardSubtitle>
          )}
        </div>
        {meta && (
          <CardMeta className={slotProps?.meta?.className} style={slotProps?.meta?.style}>
            {meta}
          </CardMeta>
        )}
      </CardHeader>
    )}
    {children && (
      <CardBody className={slotProps?.body?.className} style={slotProps?.body?.style}>
        {children}
      </CardBody>
    )}
    {footer && (
      <CardFooter
        noBorder={footerNoBorder}
        className={slotProps?.footer?.className}
        style={slotProps?.footer?.style}
      >
        {footer}
      </CardFooter>
    )}
  </CardRoot>
);

CardComponent.displayName = "Card";

/* ─── Export: Flat + Compound ─── */

export const Card = Object.assign(CardComponent, {
  Root: CardRoot,
  Thumbnail: CardThumbnail,
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Meta: CardMeta,
  Body: CardBody,
  Footer: CardFooter,
});
