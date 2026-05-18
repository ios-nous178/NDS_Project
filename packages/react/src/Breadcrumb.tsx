import React from "react";
import { cv, fontFamily, fontWeight, transition, typeScale } from "@nudge-eap/tokens";

/* ─── Constants ─── */

const BC_CLASS = "nds-breadcrumb";
const BC_ITEM_CLASS = `${BC_CLASS}__item`;
const BC_SEPARATOR_CLASS = `${BC_CLASS}__separator`;

// eslint-disable-next-line unused-imports/no-unused-vars
const breadcrumbStyles = `
  :where(.${BC_CLASS}) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-tight);
    font-family: ${fontFamily.web};
    font-size: ${typeScale.caption1.fontSize}px;
    line-height: ${typeScale.caption1.lineHeight}px;
    box-sizing: border-box;
  }

  :where(.${BC_ITEM_CLASS}) {
    color: ${cv.textRole.subtle};
    font-weight: ${fontWeight.regular};
    text-decoration: none;
    transition: color ${transition.default};
  }

  :where(a.${BC_ITEM_CLASS}:hover) {
    color: ${cv.textRole.normal};
    text-decoration: underline;
  }

  :where(.${BC_ITEM_CLASS}[data-current="true"]) {
    color: ${cv.textRole.normal};
    font-weight: ${fontWeight.medium};
    pointer-events: none;
  }

  :where(.${BC_SEPARATOR_CLASS}) {
    color: ${cv.textRole.muted};
    font-size: ${typeScale.caption1.fontSize}px;
    user-select: none;
    flex-shrink: 0;
  }
`;

/* ─── Utils ─── */

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Default separator ─── */

const ChevronSeparator = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4.5 2.5L7.5 6L4.5 9.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Types ─── */

export interface BreadcrumbItem {
  /** 텍스트 라벨 */
  label: string;
  /** 링크 URL (마지막 아이템은 생략 가능) */
  href?: string;
}

/* ─── Component ─── */

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** 브레드크럼 아이템 목록 */
  items: BreadcrumbItem[];
  /** 구분자 커스터마이즈 */
  separator?: React.ReactNode;
  /** 아이템 클릭 핸들러 (SPA 라우터 연동) */
  onItemClick?: (item: BreadcrumbItem, index: number, e: React.MouseEvent) => void;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator, onItemClick, className, ...rest }, ref) => {
    if (!items.length) return null;

    const sep = separator ?? <ChevronSeparator />;

    return (
      <nav
        ref={ref}
        data-slot="root"
        aria-label="경로"
        className={cx(BC_CLASS, className)}
        {...rest}
      >
        <ol style={{ display: "contents", listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item, idx) => {
            const isCurrent = idx === items.length - 1;

            return (
              <li key={idx} style={{ display: "contents" }}>
                {idx > 0 && (
                  <span data-slot="separator" className={BC_SEPARATOR_CLASS} aria-hidden="true">
                    {sep}
                  </span>
                )}
                {item.href && !isCurrent ? (
                  <a
                    data-slot="item"
                    href={item.href}
                    className={BC_ITEM_CLASS}
                    onClick={onItemClick ? (e) => onItemClick(item, idx, e) : undefined}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    data-slot="item"
                    data-current={isCurrent ? "true" : undefined}
                    className={BC_ITEM_CLASS}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
