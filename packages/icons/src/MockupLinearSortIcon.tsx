import React from "react";

export interface MockupLinearSortIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSortIcon = React.forwardRef<SVGSVGElement, MockupLinearSortIconProps>(
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
      <path d="M3 7h18M6 12h12M10 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
  )
);

MockupLinearSortIcon.displayName = "MockupLinearSortIcon";
