import React from "react";

/* ─── Class names ─── */

const CARD_CLASS = "nds-card";
const CARD_ROOT_CLASS = `${CARD_CLASS}__root`;
const CARD_THUMBNAIL_CLASS = `${CARD_CLASS}__thumbnail`;
const CARD_AVATAR_CLASS = `${CARD_CLASS}__avatar`;
const CARD_CHIPS_CLASS = `${CARD_CLASS}__chips`;
const CARD_HEADER_CLASS = `${CARD_CLASS}__header`;
const CARD_TEXT_CONTENT_CLASS = `${CARD_CLASS}__text-content`;
const CARD_TITLE_DESC_CLASS = `${CARD_CLASS}__title-desc`;
const CARD_BODY_CLASS = `${CARD_CLASS}__body`;
const CARD_FOOTER_CLASS = `${CARD_CLASS}__footer`;
const CARD_TITLE_CLASS = `${CARD_CLASS}__title`;
const CARD_SUBTITLE_CLASS = `${CARD_CLASS}__subtitle`;
const CARD_DESCRIPTION_CLASS = `${CARD_CLASS}__description`;
const CARD_META_CLASS = `${CARD_CLASS}__meta`;
const CARD_METADATA_CLASS = `${CARD_CLASS}__metadata`;
const CARD_DIVIDER_CLASS = `${CARD_CLASS}__divider`;
const CARD_CTA_CLASS = `${CARD_CLASS}__cta`;
const CARD_FOOTER_TEXT_CLASS = `${CARD_CLASS}__footer-text`;

/* ─── Styles ─── */
// Figma 171:9363 (Card 마스터) 사양에 맞춤:
//   - 균등 padding(--semantic-inset-card, 16px) + gap(--nds-card-gap, 12px) 의 수직 스택
//   - corner radius lg(12), thumbnail radius 10
//   - 타이포: title=Headline 5/Bold(18/26 strong), description=Body 3/Regular(14/20 subtle),
//             metadata/footerText=Caption 1/Regular(13/18 muted)
//   - 본문 갭: Title↔Description 4px · Description↔Metadata 8px
//   - Footer divider: border-top 1px + padding-top --semantic-inset-card(16)
/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Types ─── */

export type CardVariant = "outlined" | "flat";

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
  /** 고정 height (px). 기본 160. aspectRatio 가 있으면 무시. */
  height?: number;
  /** CSS aspect-ratio (예: "16/9"). 지정하면 height 대신 비율로 렌더. */
  aspectRatio?: string;
  /** 썸네일로 표시할 이미지 등 콘텐츠 */
  children: React.ReactNode;
}

export const CardThumbnail: React.FC<CardThumbnailProps> = React.memo(
  ({ height, aspectRatio, children, className, style, ...rest }) => (
    <div
      data-slot="thumbnail"
      data-ratio={aspectRatio ? "true" : "false"}
      className={cx(CARD_THUMBNAIL_CLASS, className)}
      style={{
        ...(aspectRatio && ({ "--nds-card-thumbnail-ratio": aspectRatio } as React.CSSProperties)),
        ...(height && !aspectRatio
          ? ({ "--nds-card-thumbnail-height": `${height}px` } as React.CSSProperties)
          : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardThumbnail.displayName = "CardThumbnail";

/* ─── Compound: Avatar ─── */

export interface CardAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 정사각형 size (px). 기본 40. */
  size?: number;
  children?: React.ReactNode;
}

export const CardAvatar: React.FC<CardAvatarProps> = React.memo(
  ({ size, children, className, style, ...rest }) => (
    <div
      data-slot="avatar"
      className={cx(CARD_AVATAR_CLASS, className)}
      style={{
        ...(size ? ({ "--nds-card-avatar-size": `${size}px` } as React.CSSProperties) : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  ),
);
CardAvatar.displayName = "CardAvatar";

/* ─── Compound: Chips (BadgeGroup) ─── */

export interface CardChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardChips: React.FC<CardChipsProps> = React.memo(
  ({ children, className, ...rest }) => (
    <div data-slot="chips" className={cx(CARD_CHIPS_CLASS, className)} {...rest}>
      {children}
    </div>
  ),
);
CardChips.displayName = "CardChips";

/* ─── Compound: Header (legacy — title+meta 좌우 분할) ─── */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
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

/* ─── Compound: Subtitle (legacy alias of Description) ─── */

export interface CardSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
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

/* ─── Compound: Description ─── */

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = React.memo(
  ({ children, className, ...rest }) => (
    <p data-slot="description" className={cx(CARD_DESCRIPTION_CLASS, className)} {...rest}>
      {children}
    </p>
  ),
);
CardDescription.displayName = "CardDescription";

/* ─── Compound: Meta (legacy — ReactNode) ─── */

export interface CardMetaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardMeta: React.FC<CardMetaProps> = React.memo(({ children, className, ...rest }) => (
  <div data-slot="meta" className={cx(CARD_META_CLASS, className)} {...rest}>
    {children}
  </div>
));
CardMeta.displayName = "CardMeta";

/* ─── Compound: Metadata (string) ─── */

export interface CardMetadataProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardMetadata: React.FC<CardMetadataProps> = React.memo(
  ({ children, className, ...rest }) => (
    <p data-slot="metadata" className={cx(CARD_METADATA_CLASS, className)} {...rest}>
      {children}
    </p>
  ),
);
CardMetadata.displayName = "CardMetadata";

/* ─── Compound: Body ─── */

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = React.memo(({ children, className, ...rest }) => (
  <div data-slot="body" className={cx(CARD_BODY_CLASS, className)} {...rest}>
    {children}
  </div>
));
CardBody.displayName = "CardBody";

/* ─── Compound: Divider ─── */

export const CardDivider: React.FC<React.HTMLAttributes<HTMLHRElement>> = React.memo(
  ({ className, ...rest }) => (
    <hr data-slot="divider" className={cx(CARD_DIVIDER_CLASS, className)} {...rest} />
  ),
);
CardDivider.displayName = "CardDivider";

/* ─── Compound: CTA ─── */

export interface CardCtaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardCta: React.FC<CardCtaProps> = React.memo(({ children, className, ...rest }) => (
  <div data-slot="cta" className={cx(CARD_CTA_CLASS, className)} {...rest}>
    {children}
  </div>
));
CardCta.displayName = "CardCta";

/* ─── Compound: Footer (legacy — ReactNode 가로 정렬) ─── */

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** true 이면 footer 위에 divider 표시 (legacy). */
  divider?: boolean;
  /** legacy alias: noBorder=true 이면 divider 숨김 (= divider=false) */
  noBorder?: boolean;
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = React.memo(
  ({ divider, noBorder = false, children, className, ...rest }) => {
    const showDivider = divider ?? !noBorder;
    return (
      <div
        data-slot="footer"
        data-divider={showDivider ? "true" : "false"}
        className={cx(CARD_FOOTER_CLASS, className)}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
CardFooter.displayName = "CardFooter";

/* ─── Compound: FooterText (caption 2, muted) ─── */

export interface CardFooterTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const CardFooterText: React.FC<CardFooterTextProps> = React.memo(
  ({ children, className, ...rest }) => (
    <p data-slot="footer-text" className={cx(CARD_FOOTER_TEXT_CLASS, className)} {...rest}>
      {children}
    </p>
  ),
);
CardFooterText.displayName = "CardFooterText";

/* ─── Flat API ─── */

export interface CardSlotProps {
  root?: Omit<CardRootProps, "children" | "variant" | "clickable">;
  thumbnail?: Omit<CardThumbnailProps, "children">;
  avatar?: Omit<CardAvatarProps, "children">;
  chips?: Omit<CardChipsProps, "children">;
  header?: Omit<CardHeaderProps, "children">;
  title?: Omit<CardTitleProps, "children">;
  subtitle?: Omit<CardSubtitleProps, "children">;
  description?: Omit<CardDescriptionProps, "children">;
  meta?: Omit<CardMetaProps, "children">;
  metadata?: Omit<CardMetadataProps, "children">;
  body?: Omit<CardBodyProps, "children">;
  divider?: React.HTMLAttributes<HTMLHRElement>;
  cta?: Omit<CardCtaProps, "children">;
  footer?: Omit<CardFooterProps, "children">;
  footerText?: Omit<CardFooterTextProps, "children">;
}

export interface CardProps {
  /** 스타일 변형 */
  variant?: CardVariant;
  /** 클릭 가능 여부 */
  clickable?: boolean;
  /** 썸네일 콘텐츠 (이미지 등) — Figma 기본 160px 고정 height */
  thumbnail?: React.ReactNode;
  /** 썸네일 고정 height (px). 기본 160. thumbnailRatio 가 있으면 무시 */
  thumbnailHeight?: number;
  /** 썸네일 비율 (지정하면 height 무시하고 비율로 렌더) */
  thumbnailRatio?: string;
  /** 아바타 콘텐츠 (40px circle 슬롯) */
  avatar?: React.ReactNode;
  /** Chip / Badge 그룹 (가로 정렬) */
  chips?: React.ReactNode;
  /** 제목 */
  title?: string;
  /** 설명 (Figma: description, Caption 1, subtle). subtitle 도 동일 슬롯. */
  description?: string;
  /** @deprecated description 사용 권장 — 같은 슬롯에 렌더됨 */
  subtitle?: string;
  /** 메타 텍스트 (Caption 2, muted) — Title/Description 아래 단독 줄 */
  metadata?: string;
  /** @deprecated metadata (string) 또는 자유로운 ReactNode 가 필요하면 그대로 사용 */
  meta?: React.ReactNode;
  /** 자유 본문 콘텐츠 (text-content 와 divider 사이에 렌더) */
  children?: React.ReactNode;
  /** 구분선 표시 여부 (CTA / footerText 위에 가로선) */
  divider?: boolean;
  /** CTA 슬롯 (버튼 등 액션 영역) */
  cta?: React.ReactNode;
  /** Footer 텍스트 (Caption 2, muted) */
  footerText?: string;
  /** @deprecated footer ReactNode — cta 슬롯에 렌더됨 (cta 가 없을 때만) */
  footer?: React.ReactNode;
  /** @deprecated divider=false 와 동일 */
  footerNoBorder?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  slotProps?: CardSlotProps;
}

const CardComponent: React.FC<CardProps> = ({
  variant = "outlined",
  clickable = false,
  thumbnail,
  thumbnailHeight,
  thumbnailRatio,
  avatar,
  chips,
  title,
  description,
  subtitle,
  metadata,
  meta,
  children,
  divider,
  cta,
  footerText,
  footer,
  footerNoBorder = false,
  className,
  style,
  onClick,
  slotProps,
}) => {
  const effectiveDescription = description ?? subtitle;
  // legacy: footer(ReactNode) 가 단독 사용되면 cta 슬롯으로 매핑
  const effectiveCta = cta ?? footer;
  // legacy: footerNoBorder=true 이면 divider=false (명시적으로 divider 지정한 게 우선)
  const showDivider = divider ?? !footerNoBorder;

  const hasTextContent = !!(title || effectiveDescription || metadata || meta);
  const hasDivider = showDivider && (effectiveCta || footerText);

  return (
    <CardRoot
      variant={variant}
      clickable={clickable || !!onClick}
      className={cx(slotProps?.root?.className, className)}
      style={{ ...slotProps?.root?.style, ...style }}
      onClick={onClick}
    >
      {thumbnail && (
        <CardThumbnail
          height={thumbnailHeight}
          aspectRatio={thumbnailRatio}
          className={slotProps?.thumbnail?.className}
          style={slotProps?.thumbnail?.style}
        >
          {thumbnail}
        </CardThumbnail>
      )}
      {avatar && (
        <CardAvatar className={slotProps?.avatar?.className} style={slotProps?.avatar?.style}>
          {avatar}
        </CardAvatar>
      )}
      {chips && (
        <CardChips className={slotProps?.chips?.className} style={slotProps?.chips?.style}>
          {chips}
        </CardChips>
      )}
      {hasTextContent && (
        <div className={CARD_TEXT_CONTENT_CLASS}>
          {(title || effectiveDescription) && (
            <div className={CARD_TITLE_DESC_CLASS}>
              {title && (
                <CardTitle className={slotProps?.title?.className} style={slotProps?.title?.style}>
                  {title}
                </CardTitle>
              )}
              {effectiveDescription && (
                <CardDescription
                  className={slotProps?.description?.className}
                  style={slotProps?.description?.style}
                >
                  {effectiveDescription}
                </CardDescription>
              )}
            </div>
          )}
          {metadata && (
            <CardMetadata
              className={slotProps?.metadata?.className}
              style={slotProps?.metadata?.style}
            >
              {metadata}
            </CardMetadata>
          )}
          {!metadata && meta && (
            <CardMeta className={slotProps?.meta?.className} style={slotProps?.meta?.style}>
              {meta}
            </CardMeta>
          )}
        </div>
      )}
      {children && (
        <CardBody className={slotProps?.body?.className} style={slotProps?.body?.style}>
          {children}
        </CardBody>
      )}
      {hasDivider && (
        <CardDivider className={slotProps?.divider?.className} style={slotProps?.divider?.style} />
      )}
      {effectiveCta && (
        <CardCta className={slotProps?.cta?.className} style={slotProps?.cta?.style}>
          {effectiveCta}
        </CardCta>
      )}
      {footerText && (
        <CardFooterText
          className={slotProps?.footerText?.className}
          style={slotProps?.footerText?.style}
        >
          {footerText}
        </CardFooterText>
      )}
    </CardRoot>
  );
};

CardComponent.displayName = "Card";

/* ─── Export: Flat + Compound ─── */

export const Card = Object.assign(CardComponent, {
  Root: CardRoot,
  Thumbnail: CardThumbnail,
  Avatar: CardAvatar,
  Chips: CardChips,
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Description: CardDescription,
  Meta: CardMeta,
  Metadata: CardMetadata,
  Body: CardBody,
  Divider: CardDivider,
  Cta: CardCta,
  Footer: CardFooter,
  FooterText: CardFooterText,
});
