import React from "react";

export interface TrostMkHomeActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMkHomeActiveIcon = React.forwardRef<SVGSVGElement, TrostMkHomeActiveIconProps>(
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
      <path d="M13.1811 2.85809L13.3533 3.01009L22.5239 11.9623C23.0055 12.4324 22.672 13.2499 21.9989 13.249L19.75 13.245V20.4948C19.75 20.8745 19.4678 21.1883 19.1018 21.2379L19 21.2448H14.25V13.249H9.74999V21.2448H4.99999C4.58578 21.2448 4.24999 20.909 4.24999 20.4948V13.244L1.99999 13.2448C1.37113 13.2448 1.03595 12.5278 1.39664 12.0484L1.46326 11.9709L10.1715 3.04866C10.9796 2.2204 12.2815 2.14236 13.1811 2.85809Z" fill="currentColor"/>
    </svg>
  )
);

TrostMkHomeActiveIcon.displayName = "TrostMkHomeActiveIcon";
