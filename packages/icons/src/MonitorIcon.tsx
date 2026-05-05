import React from "react";

export interface MonitorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MonitorIcon = React.forwardRef<SVGSVGElement, MonitorIconProps>(
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
      <g transform="translate(1 2)">
        <g id="ic_eap_monitor_gray500">
          <rect
            id="Rectangle 2469"
            x="1"
            y="1"
            width="20"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            id="Vector 50"
            d="M6 19L16 19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path id="Vector 49" d="M13 16V19" stroke="currentColor" strokeWidth="2" />
          <path id="Vector 52" d="M9 16V19" stroke="currentColor" strokeWidth="2" />
          <path
            id="Vector 51"
            d="M1.5 11.5H20.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  ),
);

MonitorIcon.displayName = "MonitorIcon";
