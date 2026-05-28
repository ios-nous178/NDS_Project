import React from "react";

export interface MockupLinearLink1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLink1Icon = React.forwardRef<SVGSVGElement, MockupLinearLink1IconProps>(
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
      <path d="M14.99 17.5h1.51c3.02 0 5.5-2.47 5.5-5.5 0-3.02-2.47-5.5-5.5-5.5h-1.51M9 6.5H7.5A5.51 5.51 0 0 0 2 12c0 3.02 2.47 5.5 5.5 5.5H9M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLink1Icon.displayName = "MockupLinearLink1Icon";
