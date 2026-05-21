import React from "react";

export interface MockupLinearShieldSearchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearShieldSearchIcon = React.forwardRef<SVGSVGElement, MockupLinearShieldSearchIconProps>(
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
      <path d="M20.59 10.55V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.83-.31-2.19-.31-3.02 0L5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c.7.54 1.63.8 2.56.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M20.995 21h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearShieldSearchIcon.displayName = "MockupLinearShieldSearchIcon";
