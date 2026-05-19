import React from "react";

export interface GenietGpointIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietGpointIcon = React.forwardRef<SVGSVGElement, GenietGpointIconProps>(
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
      <g transform="scale(1.2 1.2)">
<g fill="none" fillRule="evenodd">
<path d="M10 18.333a8.333 8.333 0 1 1 0-16.666 8.333 8.333 0 1 1 0 16.666z" fill="currentColor"/>
        <path d="M10.228 14.654c-.06 0-.119 0-.177-.003-.614-.027-1.353-.06-2.233-.6-2.025-1.245-2.214-3.343-2.201-4.187.024-1.624.751-3.025 1.997-3.844 1.463-.964 4.014-1.002 5.749.6a.98.98 0 1 1-1.331 1.44c-.984-.907-2.52-.942-3.339-.402-.705.464-1.101 1.257-1.116 2.235-.009.632.143 1.795 1.269 2.488.446.274.785.288 1.215.307.763.039 1.583-.3 1.782-.686.088-.173.13-.351.125-.543v-.099h-1.494a.982.982 0 1 1 0-1.96h2.474a.98.98 0 0 1 .981.98v1.054c.013.495-.102.996-.341 1.463-.604 1.173-2.112 1.757-3.36 1.757" fill="#FEFEFE"/>
    </g>
</g>
    </svg>
  )
);

GenietGpointIcon.displayName = "GenietGpointIcon";
