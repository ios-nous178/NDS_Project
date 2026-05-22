/**
 * Trost EAPBanner — Trost 웹 실측값(colors_and_type.css) 기반.
 * 4pt 그리드 예외 정책은 `trost/index.ts` 헤더 코멘트 참조.
 */
import React from "react";
import { trostEapBanner, trostNeutral } from "@nudge-eap/tokens";

export interface TrostEAPBannerProps {
  /** NudgeEAP로 유입되는 CTA 링크 (default: https://eapkorea.co.kr/) */
  href?: string;
  /** 왼쪽 빌딩 아이콘 (SVG src) */
  buildingIconSrc?: string;
  /** CTA 내부 EAP 로고 (SVG src) */
  eapLogoSrc?: string;
  /** CTA 우측 chevron 아이콘 (SVG src) */
  chevronIconSrc?: string;
  className?: string;
}

const STYLE = `
  .nds-trost-eap-banner {
    width: 100%;
    height: 50px;
    background: #d5eafb;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: inherit;
  }
  .nds-trost-eap-banner__icon {
    margin-right: 8px;
  }
  .nds-trost-eap-banner__text {
    margin-right: 20px;
    font-size: 16px;
    line-height: 1.5;
    color: ${trostNeutral[800]};
    font-weight: 400;
  }
  .nds-trost-eap-banner__text > strong {
    font-weight: 700;
  }
  .nds-trost-eap-banner__cta {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 34px;
    background: #eaf5fd;
    border-radius: 8px;
    padding: 0 11px;
    box-sizing: border-box;
    cursor: pointer;
    text-decoration: none;
  }
  .nds-trost-eap-banner__cta-logo {
    margin-right: 6px;
  }
  .nds-trost-eap-banner__cta-label {
    font-size: 14px;
    font-weight: 700;
    line-height: 1.43;
    margin-right: 2px;
    color: ${trostNeutral[800]};
  }
  .nds-trost-eap-banner__cta-label > span {
    color: ${trostEapBanner.accent};
  }
`;

export function TrostEAPBanner({
  href = "https://eapkorea.co.kr/",
  buildingIconSrc,
  eapLogoSrc,
  chevronIconSrc,
  className,
}: TrostEAPBannerProps) {
  return (
    <>
      <style>{STYLE}</style>
      <div className={["nds-trost-eap-banner", className].filter(Boolean).join(" ")}>
        {buildingIconSrc && (
          <img
            src={buildingIconSrc}
            width={25}
            height={22}
            alt=""
            className="nds-trost-eap-banner__icon"
          />
        )}
        <p className="nds-trost-eap-banner__text">
          <strong>기업 전용 멘탈케어 프로그램</strong>을 도입하고 싶다면?
        </p>
        <a className="nds-trost-eap-banner__cta" href={href} target="_blank" rel="noreferrer">
          {eapLogoSrc && (
            <img
              src={eapLogoSrc}
              width={18}
              height={18}
              alt=""
              className="nds-trost-eap-banner__cta-logo"
            />
          )}
          <p className="nds-trost-eap-banner__cta-label">
            지금 <span>넛지EAP</span> 이용해보기
          </p>
          {chevronIconSrc && <img src={chevronIconSrc} width={16} height={16} alt="" />}
        </a>
      </div>
    </>
  );
}
