import React from "react";

export interface MockupLinearMoney4IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearMoney4Icon = React.forwardRef<SVGSVGElement, MockupLinearMoney4IconProps>(
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
      <path d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.5 6H7a2.5 2.5 0 0 0-2.5 2.5V10M15.5 6H17a2.5 2.5 0 0 1 2.5 2.5V10M8.5 18H7a2.5 2.5 0 0 1-2.5-2.5V14M15.5 18H17a2.5 2.5 0 0 0 2.5-2.5V14" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearMoney4Icon.displayName = "MockupLinearMoney4Icon";
