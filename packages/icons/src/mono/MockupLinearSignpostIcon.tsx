import React from "react";

export interface MockupLinearSignpostIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearSignpostIcon = React.forwardRef<SVGSVGElement, MockupLinearSignpostIconProps>(
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
      <path d="M17.22 2H8.96c-.4 0-.78.14-1.09.38L5.68 4.13c-.88.7-.88 2.03 0 2.73l2.19 1.75c.31.25.7.38 1.09.38h8.26c.97 0 1.75-.78 1.75-1.75v-3.5c0-.96-.78-1.74-1.75-1.74ZM6.8 12h8.26c.4 0 .78.14 1.09.38l2.19 1.75c.88.7.88 2.03 0 2.73l-2.19 1.75c-.31.25-.7.38-1.09.38H6.8c-.97 0-1.75-.78-1.75-1.75v-3.5c0-.96.78-1.74 1.75-1.74ZM12 12V9M12 22v-3M9 22h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearSignpostIcon.displayName = "MockupLinearSignpostIcon";
