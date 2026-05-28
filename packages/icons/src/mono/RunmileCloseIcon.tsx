import React from "react";

export interface RunmileCloseIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileCloseIcon = React.forwardRef<SVGSVGElement, RunmileCloseIconProps>(
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
      <g transform="translate(4.15 4.15)">
    <g id="ic_close">
    <path id="Union" d="M14.249 0.249023C14.581 -0.0829222 15.1182 -0.0829222 15.4502 0.249023C15.7821 0.580974 15.7821 1.11827 15.4502 1.4502L9.05078 7.84961L15.4502 14.249C15.7821 14.581 15.7821 15.1183 15.4502 15.4502C15.1183 15.7821 14.581 15.7821 14.249 15.4502L7.84961 9.05078L1.4502 15.4502C1.11827 15.7821 0.580973 15.7821 0.249023 15.4502C-0.0829213 15.1183 -0.0829194 14.581 0.249023 14.249L6.64844 7.84961L0.249023 1.4502C-0.0829222 1.11825 -0.0829222 0.580969 0.249023 0.249023C0.580969 -0.0829222 1.11825 -0.0829222 1.4502 0.249023L7.84961 6.64844L14.249 0.249023Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileCloseIcon.displayName = "RunmileCloseIcon";
