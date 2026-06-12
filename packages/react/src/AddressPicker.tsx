import React, { useId, useState } from "react";
import { cv } from "@nudge-design/tokens";
import { Button } from "./Button.js";

/* ─── Constants ─── */

const AS_CLASS = "nds-address-picker";
const AS_LABEL_CLASS = `${AS_CLASS}__label`;
const AS_FIELD_ROW_CLASS = `${AS_CLASS}__field-row`;
const AS_INPUT_CLASS = `${AS_CLASS}__input`;
const AS_RESULT_CLASS = `${AS_CLASS}__result`;
const AS_RESULT_LIST_CLASS = `${AS_CLASS}__result-list`;
const AS_RESULT_ITEM_CLASS = `${AS_CLASS}__result-item`;
const AS_DETAIL_CLASS = `${AS_CLASS}__detail`;
const AS_HELPER_CLASS = `${AS_CLASS}__helper`;

/* ─── Types ─── */

export interface AddressResult {
  /** 도로명 주소 (예: "서울특별시 강남구 테헤란로 123") */
  roadAddress: string;
  /** 지번 주소 */
  jibunAddress?: string;
  /** 우편번호 */
  postalCode?: string;
  /** 추가 메타 (시도/시군구 등) */
  meta?: string;
}

export interface AddressValue {
  /** 선택된 주소 */
  address: AddressResult;
  /** 사용자가 입력한 상세 주소 */
  detail: string;
}

export interface AddressPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "results"
> {
  /** 검색 키워드 */
  query: string;
  /** 키워드 변경 콜백 */
  onQueryChange: (q: string) => void;
  /** 검색 트리거 (외부에서 API 호출 후 results 갱신) */
  onSearch: (q: string) => void;
  /** 검색 결과 */
  results: AddressResult[];
  /** 사용자가 선택한 주소 + 상세 주소 */
  value: AddressValue | null;
  /** 변경 콜백 */
  onValueChange: (v: AddressValue | null) => void;
  /** 라벨 */
  label?: React.ReactNode;
  /** 검색 버튼 라벨 */
  searchLabel?: string;
  /** 빈 결과 메시지 */
  emptyMessage?: React.ReactNode;
  /** 로딩 상태 */
  loading?: boolean;
  /** 헬퍼 / 에러 */
  helperText?: React.ReactNode;
  /** 에러 */
  error?: boolean;
}
const cx = (...classNames: Array<string | undefined | false | null>) =>
  classNames.filter(Boolean).join(" ");

/* ─── Component ─── */

export const AddressPicker = React.forwardRef<HTMLDivElement, AddressPickerProps>(
  (
    {
      query,
      onQueryChange,
      onSearch,
      results,
      value,
      onValueChange,
      label,
      searchLabel = "검색",
      emptyMessage = "검색 결과가 없어요",
      loading = false,
      helperText,
      error = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const inputId = useId();
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
      setSearched(true);
      onSearch(query);
    };

    const select = (addr: AddressResult) => {
      onValueChange({ address: addr, detail: value?.detail ?? "" });
    };

    return (
      <div ref={ref} data-slot="root" className={cx(AS_CLASS, className)} {...rest}>
        {label && (
          <label htmlFor={inputId} className={AS_LABEL_CLASS}>
            {label}
          </label>
        )}
        <div className={AS_FIELD_ROW_CLASS}>
          <input
            id={inputId}
            className={AS_INPUT_CLASS}
            placeholder="도로명 또는 지번 주소"
            value={query}
            data-error={error ? "true" : "false"}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <Button
            type="button"
            color="secondary"
            size="field"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "검색 중..." : searchLabel}
          </Button>
        </div>

        {searched && (
          <div className={AS_RESULT_CLASS} data-empty={results.length === 0 ? "true" : "false"}>
            {results.length === 0 && !loading ? (
              <div>{emptyMessage}</div>
            ) : (
              <ul className={AS_RESULT_LIST_CLASS}>
                {results.map((r, i) => (
                  <li
                    key={`${r.roadAddress}-${i}`}
                    className={AS_RESULT_ITEM_CLASS}
                    onClick={() => select(r)}
                  >
                    <strong>{r.roadAddress}</strong>
                    {r.jibunAddress && <span>지번: {r.jibunAddress}</span>}
                    {r.postalCode && <span>우편번호: {r.postalCode}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {value && (
          <div className={AS_DETAIL_CLASS} data-slot="detail">
            <strong>{value.address.roadAddress}</strong>
            {value.address.postalCode && (
              <span style={{ fontSize: 12, color: cv.textRole.subtle }}>
                우편번호 {value.address.postalCode}
              </span>
            )}
            <input
              placeholder="상세 주소 (동/호수)"
              value={value.detail}
              onChange={(e) => onValueChange({ ...value, detail: e.target.value })}
            />
          </div>
        )}

        {helperText && (
          <p className={AS_HELPER_CLASS} data-error={error ? "true" : "false"}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

AddressPicker.displayName = "AddressPicker";
