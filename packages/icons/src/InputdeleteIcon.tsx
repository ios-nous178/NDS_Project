import React from "react";

export interface InputdeleteIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const InputdeleteIcon = React.forwardRef<SVGSVGElement, InputdeleteIconProps>(
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
      <g transform="translate(2 2)">
        <g id="Group 3632">
          <path
            id="Exclude"
            opacity="0.4"
            d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z"
            fill="currentColor"
          />
          <path
            id="Union"
            d="M13.057 5.55715C13.3009 5.31323 13.6976 5.31355 13.9417 5.55715C14.1858 5.80123 14.1858 6.19784 13.9417 6.44192L10.6341 9.74954L13.9417 13.0572C14.1858 13.3012 14.1858 13.6978 13.9417 13.9419C13.6977 14.186 13.301 14.186 13.057 13.9419L9.74935 10.6343L6.44174 13.9419C6.19766 14.186 5.80105 14.186 5.55697 13.9419C5.31337 13.6978 5.31305 13.3011 5.55697 13.0572L8.86459 9.74954L5.55697 6.44192C5.31337 6.1978 5.31305 5.80107 5.55697 5.55715C5.80089 5.31323 6.19762 5.31355 6.44174 5.55715L9.74935 8.86477L13.057 5.55715Z"
            fill="currentColor"
          />
        </g>
      </g>
    </svg>
  ),
);

InputdeleteIcon.displayName = "InputdeleteIcon";
