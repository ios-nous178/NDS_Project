import React from "react";

export interface MockupLinearTransmitSqaure2IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTransmitSqaure2Icon = React.forwardRef<SVGSVGElement, MockupLinearTransmitSqaure2IconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.59 7.68h4.24v4.25M14.83 7.68l-5.66 5.66M6 16.51c3.89 1.3 8.11 1.3 12 0"></path>
    </svg>
  )
);

MockupLinearTransmitSqaure2Icon.displayName = "MockupLinearTransmitSqaure2Icon";
