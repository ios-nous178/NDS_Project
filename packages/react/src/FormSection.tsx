import React from "react";

/* ─── Class names ─── */

const FS_CLASS = "nds-form-section";
const FS_ROOT_CLASS = `${FS_CLASS}__root`;
const FS_HEADER_CLASS = `${FS_CLASS}__header`;
const FS_TITLE_CLASS = `${FS_CLASS}__title`;
const FS_DESC_CLASS = `${FS_CLASS}__description`;
const FS_BODY_CLASS = `${FS_CLASS}__body`;

/* ─── Types ─── */

export interface FormSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** 섹션 제목 (Headline3 24/24 Bold). 캐포비 admin 폼 그룹의 머리글. */
  title?: React.ReactNode;
  /** 제목 아래 보조 설명 (선택) */
  description?: React.ReactNode;
  /**
   * 폼 행들. `FormField density="admin"`(py-24) 과 짝으로 쓰는 것이 캐포비 admin 표준 —
   * 카드 좌우 패딩은 FormSection 이, 행 간 세로 리듬은 admin FormField 가 만든다.
   */
  children: React.ReactNode;
}

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

/**
 * FormSection — 제목 + 보더 카드로 여러 `FormField` 를 묶는 폼 그룹 컨테이너.
 *
 * 캐시워크 for Business 어드민 폼 표준 (Figma InputGuide 3080:741 · FormSection 3466:17405):
 *   · 제목 Headline3 24 Bold + (옵션) 설명
 *   · 카드 = white bg · 1px border(subtle) · radius 16(브랜드 cascade) · 좌우 패딩 24
 *   · 본문은 `FormField density="admin"` 행을 쌓아 세로 리듬(py-24)을 만든다.
 *
 * 색·radius 는 `data-brand="cashwalk-biz"` cascade 로 자동 매핑 — hex 를 직접 박지 않는다.
 */
export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  ...rest
}) => {
  return (
    <section data-slot="root" className={cx(FS_ROOT_CLASS, className)} {...rest}>
      {(title !== undefined || description !== undefined) && (
        <div data-slot="header" className={FS_HEADER_CLASS}>
          {title !== undefined && (
            <h3 data-slot="title" className={FS_TITLE_CLASS}>
              {title}
            </h3>
          )}
          {description !== undefined && (
            <p data-slot="description" className={FS_DESC_CLASS}>
              {description}
            </p>
          )}
        </div>
      )}
      <div data-slot="body" className={FS_BODY_CLASS}>
        {children}
      </div>
    </section>
  );
};

FormSection.displayName = "FormSection";
