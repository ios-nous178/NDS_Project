import React from "react";

export interface MockupLinearGrid4IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGrid4Icon = React.forwardRef<SVGSVGElement, MockupLinearGrid4IconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM9 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGrid4Icon.displayName = "MockupLinearGrid4Icon";
