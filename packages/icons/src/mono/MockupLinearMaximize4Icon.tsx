import React from "react";

export interface MockupLinearMaximize4IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMaximize4Icon = React.forwardRef<SVGSVGElement, MockupLinearMaximize4IconProps>(
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
      <path d="M21 9V3h-6M3 15v6h6M21 3l-7.5 7.5M10.5 13.5 3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMaximize4Icon.displayName = "MockupLinearMaximize4Icon";
