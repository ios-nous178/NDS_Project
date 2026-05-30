import React from "react";

export interface TrostAlarmIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostAlarmIcon = React.forwardRef<SVGSVGElement, TrostAlarmIconProps>(
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
      <g transform="translate(3 1.75)">
    <path d="M9 1.33955C13.4586 1.33955 17.0967 4.61117 17.0967 8.67647V13.904C17.6492 14.2799 18 14.8988 18 15.5837L17.9893 15.7937C17.8873 16.7605 17.0893 17.5293 16.0859 17.6276L15.8672 17.6384H12.6436C12.2445 19.2806 10.7649 20.4997 9 20.4997C7.23506 20.4997 5.75545 19.2806 5.35645 17.6384H2.13281L1.91406 17.6276C0.910673 17.5293 0.112746 16.7605 0.0107422 15.7937L0 15.5837C0 14.8988 0.350759 14.2799 0.90332 13.904V8.67647C0.90332 4.61117 4.54135 1.33955 9 1.33955ZM6.93262 17.6384C7.27718 18.4392 8.07293 18.9997 9 18.9997C9.92707 18.9997 10.7228 18.4392 11.0674 17.6384H6.93262ZM9 2.83955C5.22381 2.83955 2.40332 5.57839 2.40332 8.67647V14.698L1.74707 15.1442C1.58085 15.2573 1.5 15.424 1.5 15.5837C1.50022 15.8379 1.73063 16.1384 2.13281 16.1384H15.8672C16.2694 16.1384 16.4998 15.8379 16.5 15.5837C16.5 15.4239 16.4191 15.2573 16.2529 15.1442L15.5967 14.698V8.67647C15.5967 5.57839 12.7762 2.83955 9 2.83955Z" fill="currentColor"/>
    <path d="M9 0.75L9 1.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </g>
    </svg>
  )
);

TrostAlarmIcon.displayName = "TrostAlarmIcon";
