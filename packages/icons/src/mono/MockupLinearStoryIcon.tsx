import React from "react";

export interface MockupLinearStoryIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearStoryIcon = React.forwardRef<SVGSVGElement, MockupLinearStoryIconProps>(
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
      <path d="M16.42 7.95a6.253 6.253 0 0 1 0 8.84 6.253 6.253 0 0 1-8.84 0 6.253 6.253 0 0 1 0-8.84 6.253 6.253 0 0 1 8.84 0ZM8.25 21.64c-2-.8-3.75-2.25-4.91-4.26a9.89 9.89 0 0 1-1.25-6.25M5.85 4.48A9.936 9.936 0 0 1 12 2.36c2.27 0 4.36.77 6.04 2.05M15.75 21.64c2-.8 3.75-2.25 4.91-4.26a9.89 9.89 0 0 0 1.25-6.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearStoryIcon.displayName = "MockupLinearStoryIcon";
