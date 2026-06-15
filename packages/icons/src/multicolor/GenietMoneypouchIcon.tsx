import React from "react";

export interface GenietMoneypouchIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietMoneypouchIcon = React.forwardRef<SVGSVGElement, GenietMoneypouchIconProps>(
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
      <mask id="a" width="18" height="6" x="3" y="0" maskUnits="userSpaceOnUse">
    <path fill="#fff" d="M3.67.5h16.657v5.127H3.67V.5Z"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#FFCE55" fillRule="evenodd" d="M15.94.916c-.726-.555-1.902-.555-2.628 0-.725.556-1.901.556-2.627 0-.725-.555-1.902-.555-2.627 0-.725.556-1.902.556-2.627 0C4.953.551 4.281.431 3.67.547l3.928 5.08H16.4l3.927-5.08c-.61-.116-1.283.004-1.76.37-.726.555-1.902.555-2.628 0Z" clipRule="evenodd"/>
  </g>
  <mask id="b" width="22" height="19" x="1" y="5" maskUnits="userSpaceOnUse">
    <path fill="#fff" d="M1 5.629h22V23.69H1V5.63Z"/>
  </mask>
  <g mask="url(#b)">
    <path fill="#FFCE55" fillRule="evenodd" d="M19.786 22.434c-1.99 1.011-4.742 1.257-7.786 1.257-4.505 0-8.376-.543-10.074-3.3C1.331 19.433 1 18.199 1 16.63c0-.156.005-.307.01-.463.037-.899.18-1.768.425-2.596a10.976 10.976 0 0 1 5.058-6.462A10.915 10.915 0 0 1 12 5.628c5.767 0 10.494 4.44 10.957 10.084.029.302.043.61.043.917 0 3.03-1.224 4.798-3.214 5.805Z" clipRule="evenodd"/>
  </g>
  <path fill="#E09105" fillRule="evenodd" d="M18.043 7.253H5.953a.657.657 0 0 1-.658-.657V4.659c0-.363.294-.657.657-.657h12.09c.364 0 .658.294.658.657v1.937a.657.657 0 0 1-.657.657Z" clipRule="evenodd"/>
  <path fill="#fff" fillRule="evenodd" d="m15.995 14.447.414-1.307a.875.875 0 0 0-1.67-.529l-.897 2.84-.989-2.861a.875.875 0 0 0-1.645-.025l-1.108 2.92-.834-2.855a.875.875 0 1 0-1.68.49l.387 1.327h-.726a.747.747 0 1 0 0 1.495H8.41l.741 2.54a.875.875 0 0 0 1.659.065l1.177-3.103 1.064 3.078c.122.354.454.59.827.59h.012a.875.875 0 0 0 .823-.611l.809-2.559h1.23a.747.747 0 1 0 0-1.495h-.757Z" clipRule="evenodd"/>
    </svg>
  )
);

GenietMoneypouchIcon.displayName = "GenietMoneypouchIcon";
