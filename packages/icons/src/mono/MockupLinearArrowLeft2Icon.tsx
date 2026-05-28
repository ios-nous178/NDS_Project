import React from "react";

export interface MockupLinearArrowLeft2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearArrowLeft2Icon = React.forwardRef<SVGSVGElement, MockupLinearArrowLeft2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"></path>
    </svg>
  )
);

MockupLinearArrowLeft2Icon.displayName = "MockupLinearArrowLeft2Icon";
