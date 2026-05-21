import React from "react";

export interface MockupLinearTextUnderlineIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTextUnderlineIcon = React.forwardRef<SVGSVGElement, MockupLinearTextUnderlineIconProps>(
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
      <path d="M5 21h14M5 3v7c0 3.87 3.13 7 7 7s7-3.13 7-7V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearTextUnderlineIcon.displayName = "MockupLinearTextUnderlineIcon";
