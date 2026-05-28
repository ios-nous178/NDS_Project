import React from "react";

export interface MockupLinearGlobalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearGlobalIcon = React.forwardRef<SVGSVGElement, MockupLinearGlobalIconProps>(
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
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8 3h1a28.424 28.424 0 0 0 0 18H8M15 3a28.424 28.424 0 0 1 0 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M3 16v-1a28.424 28.424 0 0 0 18 0v1M3 9a28.424 28.424 0 0 1 18 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearGlobalIcon.displayName = "MockupLinearGlobalIcon";
