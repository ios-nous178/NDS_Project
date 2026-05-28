import React from "react";

export interface RunmileShoeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileShoeIcon = React.forwardRef<SVGSVGElement, RunmileShoeIconProps>(
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
      <g transform="translate(1.788 1.848)">
    <g id="stroke">
    <path id="Vector" d="M15.4618 5.42382C15.1018 4.79382 14.6418 4.29382 13.8618 4.03382C12.9118 3.71382 12.0618 4.11382 12.0618 4.11382C12.0618 4.11382 10.8918 4.53382 9.78183 3.75382C8.90183 3.13382 8.76183 2.56382 8.60183 2.04382C8.58183 1.97382 8.44183 1.70382 8.44183 1.70382C7.59183 0.483824 5.84183 0.603824 5.05183 1.86382L1.38183 7.58382C0.371833 9.17382 0.841833 11.2938 2.44183 12.3038L15.8318 20.7838C15.8318 20.7838 18.6918 21.8838 20.5618 19.0438C20.5618 19.0438 22.2118 16.8838 20.4918 14.3338L15.4618 5.45382V5.42382Z" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10"/>
    <path id="Vector_2" d="M1.37186 7.57382L19.8619 19.3938" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10"/>
    <path id="Vector_3" d="M16.8019 7.81382L12.9419 10.0738" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10" strokeLinecap="round"/>
    <path id="Vector_4" d="M17.8719 10.4538L15.1519 12.0538" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10" strokeLinecap="round"/>
    </g>
  </g>
    </svg>
  )
);

RunmileShoeIcon.displayName = "RunmileShoeIcon";
