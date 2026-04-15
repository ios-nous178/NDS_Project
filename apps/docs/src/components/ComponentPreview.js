import React from "react";
import styles from "./ComponentPreview.module.css";

/**
 * 컴포넌트를 시각적으로 프리뷰하는 래퍼.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - 렌더링할 컴포넌트
 * @param {string} [props.title] - 프리뷰 제목
 * @param {"light"|"dark"|"checkerboard"} [props.bg] - 배경 스타일
 * @param {boolean} [props.row] - 가로 배치 (기본 true)
 * @param {boolean} [props.centered] - 중앙 정렬 (기본 true)
 * @param {string} [props.gap] - 아이템 사이 간격
 * @param {object} [props.style] - 추가 스타일
 */
export default function ComponentPreview({
  children,
  title,
  bg = "light",
  row = true,
  centered = true,
  gap = "12px",
  style,
}) {
  return (
    <div className={styles.wrapper}>
      {title && <div className={styles.title}>{title}</div>}
      <div
        className={`${styles.preview} ${styles[bg]}`}
        style={{
          flexDirection: row ? "row" : "column",
          alignItems: centered ? "center" : "flex-start",
          justifyContent: centered ? "center" : "flex-start",
          gap,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
