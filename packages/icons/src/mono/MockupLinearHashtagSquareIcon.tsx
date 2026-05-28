import React from "react";

export interface MockupLinearHashtagSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearHashtagSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearHashtagSquareIconProps>(
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
      <path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M10 17h4c1.65 0 3-1.35 3-3v-4c0-1.65-1.35-3-3-3h-4c-1.65 0-3 1.35-3 3v4c0 1.65 1.35 3 3 3ZM12 7v10M7 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearHashtagSquareIcon.displayName = "MockupLinearHashtagSquareIcon";
