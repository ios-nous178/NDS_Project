import React from "react";

export interface MockupLinearLocationCrossIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearLocationCrossIcon = React.forwardRef<SVGSVGElement, MockupLinearLocationCrossIconProps>(
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
      <path d="M3.62 8.49c1.97-8.66 14.8-8.65 16.76.01 1.15 5.08-2.01 9.38-4.78 12.04a5.194 5.194 0 0 1-7.21 0c-2.76-2.66-5.92-6.97-4.77-12.05Z" stroke="currentColor" strokeWidth="1.5"></path><path d="M14 12.96 10.04 9M13.96 9.04 10 13" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  )
);

MockupLinearLocationCrossIcon.displayName = "MockupLinearLocationCrossIcon";
