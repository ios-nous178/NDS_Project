import React from "react";

export interface MypageActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MypageActiveIcon = React.forwardRef<SVGSVGElement, MypageActiveIconProps>(
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
      <mask maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
        <rect width="24" height="24" fill="currentColor" />
      </mask>
      <g mask="url(#mask0_0_4)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.5 20.9994C20.5 16.5811 16.6944 12.9994 12 12.9994C7.30558 12.9994 3.5 16.5811 3.5 20.9994H20.5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="6.5" r="4.5" fill="currentColor" />
      </g>
    </svg>
  ),
);

MypageActiveIcon.displayName = "MypageActiveIcon";
