import React from "react";

export interface RunmileHomeClassicIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileHomeClassicIcon = React.forwardRef<SVGSVGElement, RunmileHomeClassicIconProps>(
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
      <g transform="translate(2 1)">
    <g id="stroke">
    <path id="Rectangle 2" d="M8.51367 2.59766C9.34491 1.80256 10.6551 1.80256 11.4863 2.59766L18.4863 9.29297C18.9103 9.69848 19.1503 10.26 19.1504 10.8467V19C19.1504 20.1874 18.1874 21.1504 17 21.1504H3C1.81259 21.1504 0.849609 20.1874 0.849609 19V10.8467C0.84972 10.26 1.08973 9.69848 1.51367 9.29297L8.51367 2.59766Z" stroke="currentColor" strokeWidth="1.7"/>
    <path id="Rectangle 3" d="M10 14.8496C11.1874 14.8496 12.1504 15.8126 12.1504 17V21.1504H7.84961V17C7.84961 15.8126 8.81259 14.8496 10 14.8496Z" stroke="currentColor" strokeWidth="1.7"/>
    </g>
  </g>
  <g transform="translate(2 2.1504)">
    <g id="ic/home/storke">
    <path id="Union" d="M7.92676 0.832031C9.08654 -0.277046 10.9135 -0.277047 12.0732 0.832031L19.0732 7.52734C19.6648 8.0932 19.9999 8.87674 20 9.69531V17.8486C19.9999 19.4536 18.7394 20.7644 17.1543 20.8447L17 20.8486H3L2.8457 20.8447C1.26063 20.7644 0.000116832 19.4536 0 17.8486V9.69531C0.00010388 8.928 0.294342 8.19196 0.818359 7.63672L0.926758 7.52734L7.92676 0.832031ZM10.8984 2.06055C10.3959 1.57995 9.60414 1.57995 9.10156 2.06055L2.10156 8.75586C1.84534 9.001 1.70031 9.34071 1.7002 9.69531V17.8486C1.70032 18.5665 2.2821 19.1484 3 19.1484H7V15.8486C7 14.1918 8.34315 12.8486 10 12.8486C11.6569 12.8486 13 14.1918 13 15.8486V19.1484H17C17.7179 19.1484 18.2997 18.5665 18.2998 17.8486V9.69531C18.2997 9.34071 18.1547 9.001 17.8984 8.75586L10.8984 2.06055ZM10 14.5488C9.28203 14.5488 8.7002 15.1307 8.7002 15.8486V19.1484H11.2998V15.8486C11.2998 15.1307 10.718 14.5488 10 14.5488Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileHomeClassicIcon.displayName = "RunmileHomeClassicIcon";
