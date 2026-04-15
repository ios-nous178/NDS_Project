import type { Preview } from "@storybook/react";
import "../../../packages/react/dist/styles.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "error",
      config: {
        rules: [
          // WCAG AA 색상 대비 비율 (4.5:1 일반 텍스트, 3:1 큰 텍스트)
          { id: "color-contrast", enabled: true },
          // ARIA 속성 유효성
          { id: "aria-valid-attr", enabled: true },
          { id: "aria-valid-attr-value", enabled: true },
          // 폼 라벨 연결
          { id: "label", enabled: true },
          // 이미지 alt 텍스트
          { id: "image-alt", enabled: true },
          // 버튼 접근 가능한 이름
          { id: "button-name", enabled: true },
          // 링크 접근 가능한 이름
          { id: "link-name", enabled: true },
        ],
      },
    },
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFFFFF" },
        { name: "gray", value: "#F5F5F5" },
        { name: "dark", value: "#383838" },
      ],
    },
    chromatic: {
      modes: {
        mobile: { viewport: 375 },
        desktop: { viewport: 1280 },
      },
    },
  },
};

export default preview;
