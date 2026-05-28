import React, { useState } from "react";
import { trostYellow, trostNeutral } from "@nudge-design/tokens";

export interface TrostSearchFormProps {
  placeholder?: string;
  /** 초기 입력값 */
  defaultValue?: string;
  /** Enter / 버튼 클릭 시 호출 */
  onSearch: (keyword: string) => void;
  /** 돋보기 아이콘 SVG src */
  searchIconSrc?: string;
  className?: string;
  /** 입력 너비 (default: 530) */
  width?: number;
}

const STYLE = `
  .nds-trost-search-form {
    position: relative;
    font-family: inherit;
  }
  .nds-trost-search-form__input {
    width: var(--nds-trost-search-width, 530px);
    height: 48px;
    border: 2px solid ${trostYellow.border};
    outline: none;
    border-radius: 9999px;
    padding: 13px 36px 13px 20px;
    font-size: 15px;
    line-height: 1.47;
    color: ${trostNeutral[700]};
    font-weight: 400;
    box-sizing: border-box;
  }
  .nds-trost-search-form__input:focus {
    border-color: ${trostYellow.border};
    outline: none;
  }
  .nds-trost-search-form__input::placeholder {
    color: ${trostNeutral[700]};
    font-weight: 400;
    font-size: 15px;
    line-height: 1.47;
  }
  .nds-trost-search-form__submit {
    position: absolute;
    right: 16px;
    top: 14px;
    cursor: pointer;
    background: transparent;
    border: 0;
    padding: 0;
  }
`;

export function TrostSearchForm({
  placeholder = "전문가, 상황, 증상 등을 검색해 보세요",
  defaultValue = "",
  onSearch,
  searchIconSrc,
  className,
  width,
}: TrostSearchFormProps) {
  const [value, setValue] = useState(defaultValue);
  const submit = () => {
    if (value.trim() === "") return;
    onSearch(value);
  };
  return (
    <>
      <style>{STYLE}</style>
      <form
        className={["nds-trost-search-form", className].filter(Boolean).join(" ")}
        style={
          width ? ({ "--nds-trost-search-width": `${width}px` } as React.CSSProperties) : undefined
        }
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <input
          type="text"
          className="nds-trost-search-form__input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
        />
        <button type="submit" className="nds-trost-search-form__submit" aria-label="검색">
          {searchIconSrc ? (
            <img src={searchIconSrc} width={20} height={20} alt="" />
          ) : (
            <svg width={20} height={20} viewBox="0 0 20 20" aria-hidden>
              <circle cx="9" cy="9" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <line
                x1="13.5"
                y1="13.5"
                x2="17"
                y2="17"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </form>
    </>
  );
}
