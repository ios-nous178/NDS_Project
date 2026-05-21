import React from "react";

export interface MockupLinearHierarchy2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHierarchy2Icon = React.forwardRef<SVGSVGElement, MockupLinearHierarchy2IconProps>(
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
      <path d="M5 15V8M5.25 22a3.25 3.25 0 1 0 0-6.5 3.25 3.25 0 0 0 0 6.5ZM5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5.13 15a4.058 4.058 0 0 1 3.94-3.04l3.43.01c2.62.01 4.85-1.67 5.67-4.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHierarchy2Icon.displayName = "MockupLinearHierarchy2Icon";
