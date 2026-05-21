import React from "react";

export interface MockupLinearHierarchy3IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHierarchy3Icon = React.forwardRef<SVGSVGElement, MockupLinearHierarchy3IconProps>(
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
      <path d="M5 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 12H9c-2.2 0-4-1-4-4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHierarchy3Icon.displayName = "MockupLinearHierarchy3Icon";
