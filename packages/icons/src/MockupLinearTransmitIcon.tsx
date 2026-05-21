import React from "react";

export interface MockupLinearTransmitIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MockupLinearTransmitIcon = React.forwardRef<SVGSVGElement, MockupLinearTransmitIconProps>(
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
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M3.5 22h17M5 3.5l14 14M5 13.77V3.5h10.27"></path>
    </svg>
  )
);

MockupLinearTransmitIcon.displayName = "MockupLinearTransmitIcon";
