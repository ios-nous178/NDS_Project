import React from "react";

export interface MockupLinearMaximize3IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMaximize3Icon = React.forwardRef<SVGSVGElement, MockupLinearMaximize3IconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM18 6 6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M18 10V6h-4M6 14v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMaximize3Icon.displayName = "MockupLinearMaximize3Icon";
