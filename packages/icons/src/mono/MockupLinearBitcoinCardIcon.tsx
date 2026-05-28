import React from "react";

export interface MockupLinearBitcoinCardIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearBitcoinCardIcon = React.forwardRef<SVGSVGElement, MockupLinearBitcoinCardIconProps>(
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
      <path d="M2 8.5h11M6 16.5h2M10.5 16.5h4" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M22 11.33v4.78c0 3.51-.89 4.39-4.44 4.39H6.44C2.89 20.5 2 19.62 2 16.11V7.89c0-3.51.89-4.39 4.44-4.39h6.84" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M17 3.25h3.13c.69 0 1.25.63 1.25 1.25 0 .69-.56 1.25-1.25 1.25H17v-2.5ZM17 5.75h3.57c.79 0 1.43.56 1.43 1.25s-.64 1.25-1.43 1.25H17v-2.5ZM18.76 8.25V9.5M18.76 2v1.25M18.19 3.25H16M18.19 8.25H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearBitcoinCardIcon.displayName = "MockupLinearBitcoinCardIcon";
