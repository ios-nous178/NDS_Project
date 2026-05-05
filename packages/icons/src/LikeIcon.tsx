import React from "react";

export interface LikeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const LikeIcon = React.forwardRef<SVGSVGElement, LikeIconProps>(
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
      <g transform="translate(2.67 3.75)">
        <path
          id="shape"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.5 1C15.76 1 16.8872 1.49137 17.6979 2.30211C18.5086 3.11284 19 4.24 19 5.5C19 9.07793 15.6031 11.9141 10.7895 16.279L9.99746 17L9.22253 16.2999C4.38655 11.9053 1 9.07228 1 5.5C1 4.24 1.49137 3.11284 2.30211 2.30211C3.11284 1.49137 4.24 1 5.5 1C6.94618 1 8.33306 1.6749 9.23865 2.73834C9.54961 3.10351 9.8063 3.5174 10.0001 3.96107C10.1938 3.51725 10.4504 3.10344 10.7614 2.73834C11.6669 1.6749 13.0538 1 14.5 1Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  ),
);

LikeIcon.displayName = "LikeIcon";
