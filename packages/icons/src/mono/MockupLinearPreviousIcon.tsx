import React from "react";

export interface MockupLinearPreviousIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPreviousIcon = React.forwardRef<SVGSVGElement, MockupLinearPreviousIconProps>(
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
      <path d="M20.24 7.22v9.57c0 1.96-2.13 3.19-3.83 2.21l-4.15-2.39-4.15-2.4c-1.7-.98-1.7-3.43 0-4.41l4.15-2.4 4.15-2.39c1.7-.98 3.83.24 3.83 2.21ZM3.76 18.18V5.82" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearPreviousIcon.displayName = "MockupLinearPreviousIcon";
