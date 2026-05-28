import React from "react";

export interface TrostPlusCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostPlusCircleIcon = React.forwardRef<SVGSVGElement, TrostPlusCircleIconProps>(
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
      <g transform="scale(0.4 0.4)">
<circle cx="30" cy="30" r="30" fill="currentColor"/>
<path d="M29.9995 18.4615C30.47 18.4615 30.8595 18.8083 30.9264 19.2601L30.9366 19.3986V40.6014C30.9366 41.1189 30.5171 41.5385 29.9995 41.5385C29.5291 41.5385 29.1396 41.1918 29.0727 40.7399L29.0625 40.6014V19.3986C29.0625 18.8811 29.482 18.4615 29.9995 18.4615Z" fill="currentColor"/>
<path d="M41.5388 30C41.5388 30.4704 41.1921 30.8599 40.7403 30.9269L40.6018 30.937H19.399C18.8814 30.937 18.4619 30.5175 18.4619 30C18.4619 29.5295 18.8086 29.14 19.2605 29.0731L19.399 29.0629H40.6018C41.1193 29.0629 41.5388 29.4825 41.5388 30Z" fill="currentColor"/>
</g>
    </svg>
  )
);

TrostPlusCircleIcon.displayName = "TrostPlusCircleIcon";
