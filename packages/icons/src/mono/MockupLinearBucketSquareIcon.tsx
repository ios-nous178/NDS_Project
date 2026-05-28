import React from "react";

export interface MockupLinearBucketSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBucketSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearBucketSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M8.94 16.93L6.11 14.1c-.94-.94-.94-1.89 0-2.83l4.72-4.72 5.19 5.19c.26.26.26.68 0 .94l-4.25 4.25c-.94.94-1.89.94-2.83 0zM9.88 5.6l.95.94M5.44 12.64l10.69-.47"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.3 14.81s-1.31 1.42-1.31 2.29c0 .72.59 1.31 1.31 1.31.72 0 1.31-.59 1.31-1.31-.01-.87-1.31-2.29-1.31-2.29z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M22 15V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7z"></path>
    </svg>
  )
);

MockupLinearBucketSquareIcon.displayName = "MockupLinearBucketSquareIcon";
