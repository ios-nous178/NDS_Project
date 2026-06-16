import React from "react";

export interface RunmileAlarmIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileAlarmIcon = React.forwardRef<SVGSVGElement, RunmileAlarmIconProps>(
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
      <g transform="translate(2.4432 1.9992)">
    <g id="ic/alram">
    <path id="Union" d="M7.40657 17C7.40657 18.1874 8.36955 19.1504 9.55696 19.1504C10.7442 19.1502 11.7074 18.1873 11.7074 17H7.40657ZM9.55696 1.7002C6.00853 1.7002 3.13216 4.57657 3.13216 8.125V11.0996C3.13216 11.9041 2.98729 12.7029 2.70442 13.4561L2.01106 15.2998H17.1029L16.4095 13.4561C16.1266 12.7028 15.9818 11.9042 15.9818 11.0996V8.125C15.9818 4.57672 13.1052 1.70044 9.55696 1.7002ZM13.4066 17C13.4066 19.1262 11.6831 20.8494 9.55696 20.8496C7.43067 20.8496 5.70735 19.1263 5.70735 17H1.00032C0.302133 16.9997 -0.18075 16.3021 0.0647741 15.6484L1.11263 12.8584C1.32371 12.2963 1.43196 11.7 1.43196 11.0996V8.125C1.43196 3.63769 5.06965 0 9.55696 0C14.0441 0.000248464 17.682 3.63784 17.682 8.125V11.0996C17.682 11.7 17.7902 12.2963 18.0013 12.8584L19.0491 15.6484C19.2945 16.3019 18.8115 16.9994 18.1136 17H13.4066Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileAlarmIcon.displayName = "RunmileAlarmIcon";
