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
      <path d="M19.5 13C15.364 13 12 16.364 12 20.5C12 21.371 12.157 22.204 12.432 22.982L22.983 13.431C22.1856 13.1483 21.3461 13.0026 20.5 13Z" fill="currentColor"/>
<path d="M12 2C6.486 2 2 6.486 2 12C2 16.583 5.158 20.585 9.563 21.69C9.19215 20.6673 9.00166 19.5879 9 18.5C9 13.262 13.262 9 18.5 9C19.62 9 20.691 9.205 21.69 9.563C20.585 5.158 16.583 2 12 2Z" fill="currentColor"/>
    </svg>
  )
);

DecorationStickerIcon.displayName = "DecorationStickerIcon";
