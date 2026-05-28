import React from "react";

export interface MockupLinearToggleOnIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearToggleOnIcon = React.forwardRef<SVGSVGElement, MockupLinearToggleOnIconProps>(
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
      <path d="M13.3 16h2.4c2 0 2.8-.8 2.8-2.8v-2.4c0-2-.8-2.8-2.8-2.8h-2.4c-2 0-2.8.8-2.8 2.8v2.4c0 2 .8 2.8 2.8 2.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17 20H7c-4 0-5-1-5-5V9c0-4 1-5 5-5h10c4 0 5 1 5 5v6c0 4-1 5-5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearToggleOnIcon.displayName = "MockupLinearToggleOnIcon";
