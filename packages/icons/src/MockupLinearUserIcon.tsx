import React from "react";

export interface MockupLinearUserIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearUserIcon = React.forwardRef<SVGSVGElement, MockupLinearUserIconProps>(
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
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM20.59 22c0-3.87-3.85-7-8.59-7s-8.59 3.13-8.59 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearUserIcon.displayName = "MockupLinearUserIcon";
