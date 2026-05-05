import React from "react";

export interface CenterIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CenterIcon = React.forwardRef<SVGSVGElement, CenterIconProps>(
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
      <g transform="translate(2 2)">
        <path
          id="Exclude"
          d="M16 0C18.2091 0 20 1.79086 20 4V16C20 18.2091 18.2091 20 16 20H4C1.79086 20 3.22133e-08 18.2091 0 16V4C0 1.79086 1.79086 3.22128e-08 4 0H16ZM10 5C9.17173 5.00011 8.50011 5.67173 8.5 6.5V8.5H6.5C5.67173 8.50011 5.00011 9.17173 5 10C5 10.8284 5.67166 11.4999 6.5 11.5H8.5V13.5C8.5 14.3284 9.17166 14.9999 10 15C10.8284 15 11.5 14.3284 11.5 13.5V11.5H13.5C14.3284 11.5 15 10.8284 15 10C14.9999 9.17166 14.3284 8.5 13.5 8.5H11.5V6.5C11.4999 5.67166 10.8284 5 10 5Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

CenterIcon.displayName = "CenterIcon";
