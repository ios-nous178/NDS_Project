import React from "react";

export interface MockupLinearPathToolSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearPathToolSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearPathToolSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.75 9.12L14.9 7.27c-.7-.7-1.66-.66-2.13.08l-1.03 1.63 3.29 3.29 1.63-1.03c.71-.44.75-1.47.09-2.12z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.74 8.98l-2.39-.14c-1.34-.08-1.8.33-1.95 1.6l-.6 5.07c-.13 1.07.64 1.83 1.71 1.71l5.07-.6c1.27-.15 1.73-.61 1.6-1.95l-.14-2.39M7.49 16.52l1.85-1.85"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path>
    </svg>
  )
);

MockupLinearPathToolSquareIcon.displayName = "MockupLinearPathToolSquareIcon";
