import React from "react";

export interface TrostAlarmDotIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostAlarmDotIcon = React.forwardRef<SVGSVGElement, TrostAlarmDotIconProps>(
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
      <mask id="mask0_5022_1591" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<rect width="24" height="24" fill="white"/>
</mask>
<g mask="url(#mask0_5022_1591)">
<path d="M12 2.5L12 3.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round"/>
<path d="M12 3.08984C13.435 3.08984 14.784 3.43024 15.9551 4.02539C15.7342 4.47699 15.5878 4.97122 15.5293 5.49219C14.5226 4.92465 13.3198 4.58984 12 4.58984C8.22381 4.58984 5.40332 7.32868 5.40332 10.4268V16.4482L4.74707 16.8945C4.58094 17.0076 4.5 17.1743 4.5 17.334C4.50039 17.5882 4.73078 17.8887 5.13281 17.8887H18.8672C19.2692 17.8887 19.4996 17.5882 19.5 17.334C19.5 17.1743 19.4191 17.0076 19.2529 16.8945L18.5967 16.4482V10.4268C18.5967 10.3756 18.5933 10.3244 18.5918 10.2734C19.0349 10.4194 19.508 10.5 20 10.5C20.0323 10.5 20.0645 10.4977 20.0967 10.4971V15.6543C20.6492 16.0302 21 16.6492 21 17.334L20.9893 17.5439C20.8871 18.5106 20.0892 19.2796 19.0859 19.3779L18.8672 19.3887H15.6436C15.2445 21.0307 13.7648 22.25 12 22.25C10.2352 22.25 8.75555 21.0307 8.35645 19.3887H5.13281L4.91406 19.3779C3.91077 19.2796 3.11287 18.5106 3.01074 17.5439L3 17.334C3 16.6492 3.35084 16.0302 3.90332 15.6543V10.4268C3.90332 6.36146 7.54135 3.08984 12 3.08984ZM9.93262 19.3887C10.2772 20.1893 11.073 20.75 12 20.75C12.927 20.75 13.7228 20.1893 14.0674 19.3887H9.93262Z" fill="#333333"/>
<circle cx="20" cy="6" r="3" fill="#FF4111"/>
</g>
    </svg>
  )
);

TrostAlarmDotIcon.displayName = "TrostAlarmDotIcon";
