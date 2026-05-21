import React from "react";

export interface MockupLinearCandle2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearCandle2Icon = React.forwardRef<SVGSVGElement, MockupLinearCandle2IconProps>(
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
      <path d="M22 17.5h-7M5 17.5H2M22 6.5h-3M9 6.5H2M7 14.5h6c1.1 0 2 .5 2 2v2c0 1.5-.9 2-2 2H7c-1.1 0-2-.5-2-2v-2c0-1.5.9-2 2-2ZM11 3.5h6c1.1 0 2 .5 2 2v2c0 1.5-.9 2-2 2h-6c-1.1 0-2-.5-2-2v-2c0-1.5.9-2 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearCandle2Icon.displayName = "MockupLinearCandle2Icon";
