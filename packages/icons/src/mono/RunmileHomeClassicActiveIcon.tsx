import React from "react";

export interface RunmileHomeClassicActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileHomeClassicActiveIcon = React.forwardRef<SVGSVGElement, RunmileHomeClassicActiveIconProps>(
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
      <g transform="translate(2 2.1528)">
    <g id="ic/home/fill">
    <path id="Subtract" d="M7.92676 0.832031C9.08657 -0.277188 10.9134 -0.277189 12.0732 0.832031L19.0732 7.52734C19.6648 8.09325 19.9999 8.87663 20 9.69531V17.8486C19.9998 19.5053 18.6567 20.8486 17 20.8486H13V15.8486C13 14.1918 11.6569 12.8486 10 12.8486C8.34315 12.8486 7 14.1918 7 15.8486V20.8486H3C1.34326 20.8486 0.000186251 19.5053 0 17.8486V9.69531C5.01313e-05 8.87663 0.335161 8.09325 0.926758 7.52734L7.92676 0.832031ZM10 14.5488C10.718 14.5488 11.2998 15.1307 11.2998 15.8486V20.8486H8.7002V15.8486C8.7002 15.1307 9.28203 14.5488 10 14.5488Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileHomeClassicActiveIcon.displayName = "RunmileHomeClassicActiveIcon";
