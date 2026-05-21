import React from "react";

export interface MockupLinearRulerIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRulerIcon = React.forwardRef<SVGSVGElement, MockupLinearRulerIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" d="M5 17h14c2 0 3-1 3-3v-4c0-2-1-3-3-3H5c-2 0-3 1-3 3v4c0 2 1 3 3 3zM18 7v5M6 7v4M10.05 7L10 12M14 7v3"></path>
    </svg>
  )
);

MockupLinearRulerIcon.displayName = "MockupLinearRulerIcon";
