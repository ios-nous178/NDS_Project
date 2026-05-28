import React from "react";

export interface MockupLinearRefreshLeftSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRefreshLeftSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearRefreshLeftSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.33 7.51c.5-.15 1.05-.25 1.67-.25 2.76 0 5 2.24 5 5s-2.24 5-5 5a5.002 5.002 0 01-4.16-7.78M9.62 7.65l1.66-1.91M9.62 7.65l1.94 1.42"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path>
    </svg>
  )
);

MockupLinearRefreshLeftSquareIcon.displayName = "MockupLinearRefreshLeftSquareIcon";
