import React from "react";

export interface RunmileRadioActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileRadioActiveIcon = React.forwardRef<SVGSVGElement, RunmileRadioActiveIconProps>(
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
    <g id="ic_radiobutton">
    <path id="Union" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 1.7002C5.41604 1.7002 1.7002 5.41604 1.7002 10C1.7002 14.584 5.41604 18.2998 10 18.2998C14.584 18.2998 18.2998 14.584 18.2998 10C18.2998 5.41604 14.584 1.7002 10 1.7002Z" fill="currentColor"/>
    <circle id="Ellipse 5" cx="10" cy="10" r="6" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileRadioActiveIcon.displayName = "RunmileRadioActiveIcon";
