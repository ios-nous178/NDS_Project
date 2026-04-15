import React from "react";

export interface PushIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PushIcon = React.forwardRef<SVGSVGElement, PushIconProps>(
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
      <g transform="translate(2.85, 1.83)">
    <path d="M2.41654 15.7333C1.91113 15.7333 1.44524 15.4778 1.18548 15.0583C0.86642 14.5361 0.968066 13.8667 1.42265 13.4583L2.70736 12.3083V7.66389C2.71018 4.11389 5.72289 1 9.15348 1C12.5841 1 15.5968 4.11389 15.5968 7.66389V12.3083L16.8815 13.4583C17.3389 13.8667 17.4377 14.5389 17.1187 15.0583C16.8617 15.475 16.393 15.7333 15.8876 15.7333H2.41654Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.7196 15.8056C12.7196 17.7556 11.1243 19.3333 9.15628 19.3333C7.18828 19.3333 5.59299 17.7528 5.59299 15.8056H12.7224H12.7196Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
    </svg>
  )
);

PushIcon.displayName = "PushIcon";
