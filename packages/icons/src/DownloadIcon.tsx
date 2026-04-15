import React from "react";

export interface DownloadIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const DownloadIcon = React.forwardRef<SVGSVGElement, DownloadIconProps>(
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
      <path d="M21 15V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
);

DownloadIcon.displayName = "DownloadIcon";
