import React from "react";

export interface MockupLinearMusicDashboardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMusicDashboardIcon = React.forwardRef<SVGSVGElement, MockupLinearMusicDashboardIconProps>(
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
      <path d="M22 15V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7ZM7 2.5v19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.47 16.8a1.49 1.49 0 1 0 0-2.98 1.49 1.49 0 0 0 0 2.98Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M18.43 14.31V8.48c0-1.24-.78-1.41-1.57-1.2l-2.98.81c-.54.15-.92.58-.92 1.2v6.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16.93 15.8a1.49 1.49 0 1 0 0-2.98 1.49 1.49 0 0 0 0 2.98ZM12.96 11.04l5.47-1.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMusicDashboardIcon.displayName = "MockupLinearMusicDashboardIcon";
