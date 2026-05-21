import React from "react";

export interface MockupLinearGrid8IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGrid8Icon = React.forwardRef<SVGSVGElement, MockupLinearGrid8IconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM2 12h20M8.25 12v9.5M15.75 22V12M8.25 12V2M15.75 12V2.54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGrid8Icon.displayName = "MockupLinearGrid8Icon";
