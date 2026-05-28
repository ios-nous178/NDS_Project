import React from "react";

export interface MockupLinearCardRemove1IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCardRemove1Icon = React.forwardRef<SVGSVGElement, MockupLinearCardRemove1IconProps>(
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
      <path d="M2 8.5h11.5M6 16.5h2M10.5 16.5h4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 12.03v4.08c0 3.51-.89 4.39-4.44 4.39H6.44C2.89 20.5 2 19.62 2 16.11V7.89c0-3.51.89-4.39 4.44-4.39h7.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="m17.309 8.19 3.88-3.88M21.189 8.19l-3.88-3.88" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
  )
);

MockupLinearCardRemove1Icon.displayName = "MockupLinearCardRemove1Icon";
