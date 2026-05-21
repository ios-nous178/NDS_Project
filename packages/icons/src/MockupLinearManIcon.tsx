import React from "react";

export interface MockupLinearManIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearManIcon = React.forwardRef<SVGSVGElement, MockupLinearManIconProps>(
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
      <path d="M10.25 21.5a7.75 7.75 0 1 0 0-15.5 7.75 7.75 0 0 0 0 15.5ZM21.5 2.5 16 8M15 2.5h6.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearManIcon.displayName = "MockupLinearManIcon";
