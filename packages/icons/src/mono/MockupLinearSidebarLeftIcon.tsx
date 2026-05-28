import React from "react";

export interface MockupLinearSidebarLeftIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSidebarLeftIcon = React.forwardRef<SVGSVGElement, MockupLinearSidebarLeftIconProps>(
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
      <path d="M21.97 15V9c0-5-2-7-7-7h-6c-5 0-7 2-7 7v6c0 5 2 7 7 7h6c5 0 7-2 7-7ZM7.97 2v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M14.97 9.44 12.41 12l2.56 2.56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSidebarLeftIcon.displayName = "MockupLinearSidebarLeftIcon";
