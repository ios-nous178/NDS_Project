import React from "react";

export interface MockupLinearLayoutMaximizeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLayoutMaximizeIcon = React.forwardRef<SVGSVGElement, MockupLinearLayoutMaximizeIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M18 10V6h-4M6 14v4h4M6 6l12 12M6 10V6h4M18 14v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLayoutMaximizeIcon.displayName = "MockupLinearLayoutMaximizeIcon";
