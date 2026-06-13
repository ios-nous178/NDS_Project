import React, { useEffect, useRef } from "react";
import {
  decorateContentDom,
  sanitizeContentDom,
  stripDangerous,
} from "./internal/contentSanitize.js";

/* ─── Class names ─── */

const AR_CLASS = "nds-article";
const AR_ROOT_CLASS = `${AR_CLASS}__root`;
const AR_HEADER_CLASS = `${AR_CLASS}__header`;
const AR_TITLE_CLASS = `${AR_CLASS}__title`;
const AR_META_CLASS = `${AR_CLASS}__meta`;
const AR_BODY_CLASS = `${AR_CLASS}__body`;
const AR_ATTACHMENTS_CLASS = `${AR_CLASS}__attachments`;
const AR_ATTACHMENTS_LABEL_CLASS = `${AR_CLASS}__attachments-label`;
const AR_ACTIONS_CLASS = `${AR_CLASS}__actions`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Compound: Root ─── */

export interface ArticleRootProps extends React.HTMLAttributes<HTMLElement> {
  /** 게시글 구성 (Header / Body / Attachments / Actions) */
  children: React.ReactNode;
}

export const ArticleRoot: React.FC<ArticleRootProps> = ({ children, className, ...rest }) => (
  <article data-slot="root" className={cx(AR_ROOT_CLASS, className)} {...rest}>
    {children}
  </article>
);
ArticleRoot.displayName = "ArticleRoot";

/* ─── Compound: Header (제목 + 메타) ─── */

export interface ArticleHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /** 게시글 제목 */
  title?: string;
  /** 제목 heading 레벨 @default 2 */
  level?: 1 | 2 | 3 | 4;
  /** 메타 행 (작성자 · 날짜 · 조회수 등 — 앱이 주입) */
  children?: React.ReactNode;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  level = 2,
  children,
  className,
  ...rest
}) => {
  const Heading = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return (
    <header data-slot="header" className={cx(AR_HEADER_CLASS, className)} {...rest}>
      {title && <Heading className={AR_TITLE_CLASS}>{title}</Heading>}
      {children && <div className={AR_META_CLASS}>{children}</div>}
    </header>
  );
};
ArticleHeader.displayName = "ArticleHeader";

/* ─── Compound: Body (본문) ─── */

export interface ArticleBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 본문 HTML 문자열 — 주면 sanitize(위험태그 제거 + allowlist) 후 안전 렌더 */
  html?: string;
  /** sanitize 끄기 (신뢰된 본문) @default true */
  sanitize?: boolean;
  /** 이미지에 loading="lazy" + decoding="async" 자동 (html 본문) @default true */
  imageLazy?: boolean;
  /** 외부 링크에 target="_blank" + rel=noopener 자동 (html 본문) @default true */
  externalLinkBlank?: boolean;
  /** html 대신 직접 ReactNode 본문 */
  children?: React.ReactNode;
}

/**
 * 본문 — html 을 주면 sanitize 유틸(구 ContentViewer 에서 강등)로 안전 렌더하고,
 * 아니면 children 을 그대로 렌더한다. prose 타이포는 .nds-article__body 가 담당.
 */
export const ArticleBody: React.FC<ArticleBodyProps> = ({
  html,
  sanitize = true,
  imageLazy = true,
  externalLinkBlank = true,
  children,
  className,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const safeHtml = html !== undefined ? (sanitize ? stripDangerous(html) : html) : undefined;

  useEffect(() => {
    const root = ref.current;
    if (!root || safeHtml === undefined) return;
    if (sanitize) sanitizeContentDom(root);
    decorateContentDom(root, { imageLazy, externalLinkBlank });
  }, [safeHtml, sanitize, imageLazy, externalLinkBlank]);

  if (safeHtml !== undefined) {
    return (
      <div
        ref={ref}
        data-slot="body"
        className={cx(AR_BODY_CLASS, className)}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
        {...rest}
      />
    );
  }

  return (
    <div data-slot="body" className={cx(AR_BODY_CLASS, className)} {...rest}>
      {children}
    </div>
  );
};
ArticleBody.displayName = "ArticleBody";

/* ─── Compound: Attachments (첨부) ─── */

export interface ArticleAttachmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 섹션 라벨 (예: "첨부파일") */
  label?: string;
  /** AttachmentItem 목록 */
  children: React.ReactNode;
}

export const ArticleAttachments: React.FC<ArticleAttachmentsProps> = ({
  label,
  children,
  className,
  ...rest
}) => (
  <div data-slot="attachments" className={cx(AR_ATTACHMENTS_CLASS, className)} {...rest}>
    {label && <div className={AR_ATTACHMENTS_LABEL_CLASS}>{label}</div>}
    {children}
  </div>
);
ArticleAttachments.displayName = "ArticleAttachments";

/* ─── Compound: Actions (하단 액션 바) ─── */

export interface ArticleActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 액션 (LikeButton / 공유 / 신고 등 — 앱이 주입) */
  children: React.ReactNode;
}

export const ArticleActions: React.FC<ArticleActionsProps> = ({ children, className, ...rest }) => (
  <div data-slot="actions" className={cx(AR_ACTIONS_CLASS, className)} {...rest}>
    {children}
  </div>
);
ArticleActions.displayName = "ArticleActions";

/* ─── Export: Compound ─── */

/**
 * Article — 게시글/공지/FAQ 상세 보기 셸. 제목·메타 + 본문(sanitize 렌더) + 첨부 + 액션을
 * 묶는 **레이아웃 셸**이다. 좋아요 카운트·권한·작성자 데이터 등 **앱 로직은 0** — 모두 슬롯에
 * 주입한다. 목록/피드의 게시글 "카드"는 Card + ListItem 조합 패턴을 쓴다(Article 은 상세 전용).
 *
 * @example
 * <Article.Root>
 *   <Article.Header title="6월 점검 안내">
 *     <span>운영팀 · 2026.06.13 · 조회 1,204</span>
 *   </Article.Header>
 *   <Article.Body html={post.contentHtml} />
 *   <Article.Attachments label="첨부파일">
 *     <AttachmentItem fileName="점검안내.pdf" />
 *   </Article.Attachments>
 *   <Article.Actions>
 *     <LikeButton count={post.likes} active={post.liked} onClick={toggleLike} />
 *   </Article.Actions>
 * </Article.Root>
 */
const ArticleComponent: React.FC<ArticleRootProps> = (props) => <ArticleRoot {...props} />;
ArticleComponent.displayName = "Article";

export const Article = Object.assign(ArticleComponent, {
  Root: ArticleRoot,
  Header: ArticleHeader,
  Body: ArticleBody,
  Attachments: ArticleAttachments,
  Actions: ArticleActions,
});
