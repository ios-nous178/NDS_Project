import React from "react";

export interface MockupLinearUserSearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearUserSearchIcon = React.forwardRef<SVGSVGElement, MockupLinearUserSearchIconProps>(
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
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3.41 22c0-3.87 3.85-7 8.59-7M18.2 21.4a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4ZM22 22l-1-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearUserSearchIcon.displayName = "MockupLinearUserSearchIcon";
