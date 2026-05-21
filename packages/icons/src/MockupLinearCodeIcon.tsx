import React from "react";

export interface MockupLinearCodeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCodeIcon = React.forwardRef<SVGSVGElement, MockupLinearCodeIconProps>(
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
      <path d="M9 13c-.66.33-1.21.82-1.62 1.43-.23.35-.23.79 0 1.14.41.61.96 1.1 1.62 1.43M15.21 13c.66.33 1.21.82 1.62 1.43.23.35.23.79 0 1.14-.41.61-.96 1.1-1.62 1.43" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7ZM2.23 8.01 21.45 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCodeIcon.displayName = "MockupLinearCodeIcon";
