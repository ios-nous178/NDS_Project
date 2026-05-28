import React from "react";

export interface MockupLinearHierarchySquare2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHierarchySquare2Icon = React.forwardRef<SVGSVGElement, MockupLinearHierarchySquare2IconProps>(
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
      <path d="M7.8 10.2v4.2M7.95 9.9a1.95 1.95 0 1 0 0-3.9 1.95 1.95 0 0 0 0 3.9ZM7.8 18a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM16.2 18a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M7.88 10.2a2.425 2.425 0 0 0 2.36 1.82l2.06-.01c1.57-.01 2.91 1 3.4 2.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHierarchySquare2Icon.displayName = "MockupLinearHierarchySquare2Icon";
