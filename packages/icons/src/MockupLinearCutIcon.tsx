import React from "react";

export interface MockupLinearCutIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCutIcon = React.forwardRef<SVGSVGElement, MockupLinearCutIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M8.42 10.9a1.92 1.92 0 1 0 0-3.84 1.92 1.92 0 0 0 0 3.84ZM8.42 16.94a1.92 1.92 0 1 0 0-3.84 1.92 1.92 0 0 0 0 3.84ZM17.5 8.7l-7.34 5.49M17.5 15.28l-7.34-5.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCutIcon.displayName = "MockupLinearCutIcon";
