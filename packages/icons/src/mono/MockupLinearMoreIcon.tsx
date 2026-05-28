import React from "react";

export interface MockupLinearMoreIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMoreIcon = React.forwardRef<SVGSVGElement, MockupLinearMoreIconProps>(
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
      <path d="M5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM19 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z" stroke="currentColor" strokeWidth="1.5"></path>
    </svg>
  )
);

MockupLinearMoreIcon.displayName = "MockupLinearMoreIcon";
