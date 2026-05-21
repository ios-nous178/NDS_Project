import React from "react";

export interface MockupLinearGlobalRefreshIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGlobalRefreshIcon = React.forwardRef<SVGSVGElement, MockupLinearGlobalRefreshIconProps>(
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
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8 3h1a28.424 28.424 0 0 0 0 18H8M15 3c.97 2.92 1.46 5.96 1.46 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 16v-1c2.92.97 5.96 1.46 9 1.46M3 9a28.424 28.424 0 0 1 18 0M19.5 14.7c-.37-.11-.79-.18-1.25-.18a3.74 3.74 0 0 0 0 7.48c2.06 0 3.74-1.68 3.74-3.74a3.7 3.7 0 0 0-.63-2.08M20.04 14.8l-1.25-1.43M20.04 14.8l-1.46 1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGlobalRefreshIcon.displayName = "MockupLinearGlobalRefreshIcon";
