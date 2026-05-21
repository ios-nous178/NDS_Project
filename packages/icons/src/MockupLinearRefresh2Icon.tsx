import React from "react";

export interface MockupLinearRefresh2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearRefresh2Icon = React.forwardRef<SVGSVGElement, MockupLinearRefresh2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.55 21.67C18.84 20.54 22 16.64 22 12c0-5.52-4.44-10-10-10C5.33 2 2 7.56 2 7.56m0 0V3m0 4.56H6.44"></path><path stroke="currentColor" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2 12c0 5.52 4.48 10 10 10"></path>
    </svg>
  )
);

MockupLinearRefresh2Icon.displayName = "MockupLinearRefresh2Icon";
