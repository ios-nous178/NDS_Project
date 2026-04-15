import React from "react";

export interface LocateIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const LocateIcon = React.forwardRef<SVGSVGElement, LocateIconProps>(
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
      <g transform="translate(2.4,0.267)">
    <path d="M9.59639 1.79999C4.88834 1.79999 0.946725 5.68686 1.0699 10.4907C1.22045 16.3895 6.92759 20.7417 8.91208 22.0829C9.32267 22.3566 9.85643 22.3429 10.2533 22.0555C12.2515 20.5774 18.1229 15.7599 18.1229 10.5044C18.1229 5.71423 14.3044 1.79999 9.59639 1.79999ZM9.59639 13.0227C8.02248 13.0227 6.73598 11.7362 6.73598 10.1622C6.73598 8.58833 8.02248 7.30183 9.59639 7.30183C11.1703 7.30183 12.4568 8.58833 12.4568 10.1622C12.4568 11.7362 11.1703 13.0227 9.59639 13.0227Z" fill="currentColor"/>
  </g>
    </svg>
  )
);

LocateIcon.displayName = "LocateIcon";
