import React from "react";

export interface DecorationStickerIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const DecorationStickerIcon = React.forwardRef<SVGSVGElement, DecorationStickerIconProps>(
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
        <path
          id="Vector"
          d="M10 0C4.486 0 0 4.486 0 10C0 14.583 3.158 18.585 7.563 19.69C7.19215 18.6673 7.00166 17.5879 7 16.5C7 11.262 11.262 7 16.5 7C17.62 7 18.691 7.205 19.69 7.563C18.585 3.158 14.583 0 10 0Z"
          fill="currentColor"
        />
      </g>
    </svg>
  ),
);

DecorationStickerIcon.displayName = "DecorationStickerIcon";
