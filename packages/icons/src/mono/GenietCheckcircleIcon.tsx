import React from "react";

export interface GenietCheckcircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietCheckcircleIcon = React.forwardRef<SVGSVGElement, GenietCheckcircleIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0.25 0.25 63.49 63.49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g transform="scale(0.375 0.375)">
<circle cx="32.0002" cy="31.9997" r="26.6667" fill="currentColor"/>
<path d="M40.9896 23.8097C41.8315 22.8836 43.2638 22.8146 44.1901 23.656C45.1162 24.4979 45.1852 25.9302 44.3437 26.8565L31.0104 41.5232C30.5936 41.9817 30.0074 42.2504 29.388 42.2654C28.7683 42.2801 28.1701 42.0396 27.7318 41.6013L19.7318 33.6013C18.8466 32.7161 18.8466 31.2834 19.7318 30.3982C20.617 29.513 22.0497 29.513 22.9349 30.3982L29.2526 36.7159L40.9896 23.8097Z" fill="currentColor"/>
</g>
    </svg>
  )
);

GenietCheckcircleIcon.displayName = "GenietCheckcircleIcon";
