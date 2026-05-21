import React from "react";

export interface MockupLinearTransmitSquareIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTransmitSquareIcon = React.forwardRef<SVGSVGElement, MockupLinearTransmitSquareIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7z"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 9.51l3-3 3 3M12 6.51v8M6 16.51c3.89 1.3 8.11 1.3 12 0"></path>
    </svg>
  )
);

MockupLinearTransmitSquareIcon.displayName = "MockupLinearTransmitSquareIcon";
