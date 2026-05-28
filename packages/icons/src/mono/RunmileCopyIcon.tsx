import React from "react";

export interface RunmileCopyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileCopyIcon = React.forwardRef<SVGSVGElement, RunmileCopyIconProps>(
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
      <g transform="translate(3.3408 2.8392)">
    <g id="ic_copy">
    <path id="Union" d="M9.62988 4.11035C11.2645 4.1105 12.5898 5.43564 12.5898 7.07031V15.5703C12.5895 17.2047 11.2643 18.5301 9.62988 18.5303H2.95996C1.32544 18.5303 0.00038805 17.2047 0 15.5703V7.07031C0 5.43555 1.3252 4.11035 2.95996 4.11035H9.62988ZM2.95996 5.80957C2.26408 5.80957 1.69922 6.37443 1.69922 7.07031V15.5703C1.69961 16.2659 2.26432 16.8301 2.95996 16.8301H9.62988C10.3254 16.8299 10.8893 16.2658 10.8896 15.5703V7.07031C10.8896 6.37452 10.3256 5.80972 9.62988 5.80957H2.95996ZM13.9199 0C15.5592 0.000146475 16.8799 1.32061 16.8799 2.95996V11.46C16.8797 13.0992 15.5591 14.4198 13.9199 14.4199V12.7197C14.6202 12.7196 15.1795 12.1603 15.1797 11.46V2.95996C15.1797 2.25949 14.6204 1.69936 13.9199 1.69922H7.25C6.54944 1.69922 5.98926 2.2594 5.98926 2.95996H4.29004C4.29004 1.32052 5.61056 0 7.25 0H13.9199Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileCopyIcon.displayName = "RunmileCopyIcon";
