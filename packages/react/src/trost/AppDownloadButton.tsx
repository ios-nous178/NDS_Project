import React from "react";
import { trostNeutral, trostStatus } from "@nudge-design/tokens";

export interface TrostAppDownloadButtonProps {
  /** 호버 툴팁 내부 QR 이미지 src */
  qrImageSrc?: string;
  /** 호버 툴팁 배경 SVG (말풍선 프레임) src */
  tooltipBgSrc?: string;
  className?: string;
}

const STYLE = `
  .nds-trost-app-dl { position: relative; font-family: inherit; display: inline-block; }
  .nds-trost-app-dl__btn {
    height: 44px;
    padding: 11px 16px;
    border-radius: 12px;
    border: 1px solid ${trostNeutral[300]};
    background: #fff;
    font-size: 15px;
    line-height: 22px;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
  }
  .nds-trost-app-dl__tooltip {
    position: absolute;
    left: -201px;
    opacity: 0;
    pointer-events: none;
    z-index: 200;
    transition: opacity .2s;
  }
  .nds-trost-app-dl:hover .nds-trost-app-dl__tooltip {
    opacity: 1;
    pointer-events: auto;
  }
  .nds-trost-app-dl__tooltip-inner {
    width: 366px;
    height: 186px;
    position: relative;
  }
  .nds-trost-app-dl__tooltip-bg {
    position: absolute;
    top: 0;
    z-index: 0;
  }
  .nds-trost-app-dl__tooltip-content {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    padding: 38px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
  }
  .nds-trost-app-dl__tooltip-text {
    font-size: 20px;
    font-weight: 700;
    color: #000;
    line-height: 1.5;
  }
  .nds-trost-app-dl__tooltip-text span {
    color: ${trostStatus.orange};
  }
`;

export function TrostAppDownloadButton({
  qrImageSrc,
  tooltipBgSrc,
  className,
}: TrostAppDownloadButtonProps) {
  return (
    <>
      <style>{STYLE}</style>
      <div className={["nds-trost-app-dl", className].filter(Boolean).join(" ")}>
        <button type="button" className="nds-trost-app-dl__btn">
          앱 다운로드
        </button>
        <div className="nds-trost-app-dl__tooltip">
          <div className="nds-trost-app-dl__tooltip-inner">
            {tooltipBgSrc && (
              <img
                src={tooltipBgSrc}
                width={366}
                height={186}
                alt=""
                className="nds-trost-app-dl__tooltip-bg"
              />
            )}
            <div className="nds-trost-app-dl__tooltip-content">
              <p className="nds-trost-app-dl__tooltip-text">
                마음을 챙기는 습관,
                <br />
                <span>트로스트</span> 앱과 함께
                <br />
                만들어 보세요
              </p>
              {qrImageSrc && (
                <img
                  src={qrImageSrc}
                  alt="trost app download qr"
                  width={120}
                  height={120}
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
