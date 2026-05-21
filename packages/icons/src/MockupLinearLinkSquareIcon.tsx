import React from "react";

export interface MockupLinearLinkSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLinkSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearLinkSquareIconProps>(
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
      <path d="M8.18 16.02c-.76-.07-1.51-.42-2.09-1.03-1.32-1.39-1.32-3.67 0-5.06l2.19-2.3a3.307 3.307 0 0 1 4.82 0c1.32 1.39 1.32 3.67 0 5.06l-1.09 1.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M15.82 7.98c.76.07 1.51.42 2.09 1.03 1.32 1.39 1.32 3.67 0 5.06l-2.19 2.3a3.307 3.307 0 0 1-4.82 0c-1.32-1.39-1.32-3.67 0-5.06l1.09-1.15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLinkSquareIcon.displayName = "MockupLinearLinkSquareIcon";
