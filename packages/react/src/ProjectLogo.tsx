import React from "react";
import type { ProjectSlug } from "@nudge-design/tokens";
import {
  TROST_LOGO_DATA_URI,
  GENIET_LOGO_PC_DATA_URI,
  NUDGE_EAP_LOGO_DATA_URI,
  CASHWALK_BIZ_LOGO_DATA_URI,
  RUNMILE_LOGO_DATA_URI,
} from "./project-logo-defaults.js";

/* ─── Constants ─── */

const BL_CLASS = "nds-project-logo";

/* ─── Types ─── */

export type { ProjectSlug };

interface ProjectLogoEntry {
  src: string;
  alt: string;
}

/**
 * 프로젝트 대표 로고 — base64 data URI 는 `@nudge-design/assets/project-logo-defaults`(SSOT).
 * `<nds-sidebar project>` / `<nds-project-header project>` 가 주입하는 것과 **동일한 로고**다.
 */
const PROJECT_LOGOS: Record<ProjectSlug, ProjectLogoEntry> = {
  trost: { src: TROST_LOGO_DATA_URI, alt: "Trost" },
  geniet: { src: GENIET_LOGO_PC_DATA_URI, alt: "Geniet" },
  "nudge-eap": { src: NUDGE_EAP_LOGO_DATA_URI, alt: "NudgeEAP" },
  "cashwalk-biz": { src: CASHWALK_BIZ_LOGO_DATA_URI, alt: "Cashwalk for Business" },
  runmile: { src: RUNMILE_LOGO_DATA_URI, alt: "Runmile" },
};

export interface ProjectLogoProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  /** 프로젝트 */
  project: ProjectSlug;
  /** 로고 높이 px (기본 40, 폭은 비율 유지 auto) */
  height?: number;
  /** 폭 px 강제 (기본 auto — height 기준 비율) */
  width?: number;
  /** alt 오버라이드 (기본 프로젝트명) */
  alt?: string;
  /** 지정 시 <a>로 감싸 링크 */
  href?: string;
}

const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

/**
 * ProjectLogo — 프로젝트 대표 로고를 컴포넌트로 박는다. raw `<img>`/SVG 직접 조립 금지.
 *
 * 어드민 온보딩 카드처럼 project chrome(헤더/사이드바) 이 없는 화면에서 35KB base64 를
 * 손으로 붙이지 않고 로고를 넣는 표준 진입점. data URI 가 내장돼 단일 HTML/오프라인에서도 안 깨진다.
 */
export const ProjectLogo = React.forwardRef<HTMLSpanElement, ProjectLogoProps>(
  ({ project, height = 40, width, alt, href, className, style, ...rest }, ref) => {
    const entry = PROJECT_LOGOS[project];
    if (!entry) return null;

    const img = (
      <img
        className={`${BL_CLASS}__img`}
        src={entry.src}
        alt={alt ?? entry.alt}
        style={{ height: `${height}px`, width: width != null ? `${width}px` : "auto" }}
      />
    );

    return (
      <span
        ref={ref}
        className={cx(BL_CLASS, className)}
        data-project={project}
        style={style}
        {...rest}
      >
        {href ? (
          <a className={`${BL_CLASS}__link`} href={href}>
            {img}
          </a>
        ) : (
          img
        )}
      </span>
    );
  },
);

ProjectLogo.displayName = "ProjectLogo";
