import React from "react";

export interface MockupLinearDirectUpIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearDirectUpIcon = React.forwardRef<SVGSVGElement, MockupLinearDirectUpIconProps>(
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
      <path d="M9.17 4.71 3.07 16.3c-1.45 2.75 1.48 5.74 4.26 4.35l3.24-1.62c.9-.45 1.96-.45 2.86 0l3.24 1.62c2.78 1.39 5.7-1.6 4.26-4.35l-6.1-11.59c-1.2-2.28-4.46-2.28-5.66 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearDirectUpIcon.displayName = "MockupLinearDirectUpIcon";
