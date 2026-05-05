import React from "react";

export interface PlayIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PlayIcon = React.forwardRef<SVGSVGElement, PlayIconProps>(
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
      <g id="Group">
        <g id="Rectangle"></g>
        <path
          id="Path 10"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.1094 4.07293C8.78029 3.18686 7 4.13964 7 5.73703V18.263C7 19.8604 8.78029 20.8131 10.1094 19.9271L19.5039 13.6641C20.6913 12.8725 20.6913 11.1275 19.5038 10.3359L10.1094 4.07293Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

PlayIcon.displayName = "PlayIcon";
