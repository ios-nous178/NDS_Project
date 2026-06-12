import React from "react";

import { Select } from "./Select.js";

/* ─── Component ─── */

export interface PageSizeSelectProps {
  /** 현재 페이지 크기 (rows per page) */
  value: number;
  /** 변경 콜백 */
  onValueChange: (value: number) => void;
  /** 선택 가능한 페이지 크기 목록 @default [30, 50, 100] */
  options?: number[];
  /** 라벨 포맷터 @default (n) => `${n}개씩 보기` */
  formatLabel?: (size: number) => string;
  /** 비활성화 */
  disabled?: boolean;
  /** 루트 className */
  className?: string;
}

const DEFAULT_OPTIONS = [30, 50, 100];
const defaultFormat = (n: number) => `${n}개씩 보기`;

/**
 * PageSizeSelect — Pagination 과 짝을 이루는 "행 수 선택" 드롭다운("100개씩 보기").
 *
 * 리포트/리스트 표 하단 우측에 두어 한 페이지에 보여줄 행 수를 고른다.
 * 내부적으로 `Select`(auto 폭) 를 재사용하므로 드롭다운 동작/스타일이 DS 와 일관된다.
 * Figma 캐포비 인구통계별·광고별 리포트(3001:30014 / 3001:28554) 하단 selector 정합.
 *
 * @example
 * <PageSizeSelect value={pageSize} onValueChange={setPageSize} />
 */
export const PageSizeSelect: React.FC<PageSizeSelectProps> = ({
  value,
  onValueChange,
  options = DEFAULT_OPTIONS,
  formatLabel = defaultFormat,
  disabled = false,
  className,
}) => {
  return (
    <Select
      options={options.map((n) => ({ value: String(n), label: formatLabel(n) }))}
      value={String(value)}
      onValueChange={(v) => onValueChange(Number(v))}
      disabled={disabled}
      fullWidth={false}
      className={className}
    />
  );
};

PageSizeSelect.displayName = "PageSizeSelect";
