import React from "react";

export interface RunmileCheckCircleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const RunmileCheckCircleIcon = React.forwardRef<SVGSVGElement, RunmileCheckCircleIconProps>(
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
      <g transform="translate(6.166 6.166)">
    <g id="ic_circlecheck">
    <rect id="Rectangle 8" width="11.6667" height="11.6667" rx="5.83333" fill="currentColor"/>
    <path id="Vector 319 (Stroke)" d="M8.09831 3.7421C8.28665 3.54338 8.60079 3.535 8.79956 3.7233C8.99828 3.91165 9.00667 4.22579 8.81836 4.42456L5.50236 7.92456C5.40873 8.02328 5.2784 8.07894 5.14233 8.07894C5.00626 8.07888 4.8759 8.02335 4.78231 7.92456L2.84831 5.88289C2.66 5.68412 2.66839 5.36998 2.86711 5.18164C3.06587 4.99333 3.38002 5.00172 3.56836 5.20044L5.14233 6.86157L8.09831 3.7421Z" fill="currentColor"/>
    </g>
  </g>
    </svg>
  )
);

RunmileCheckCircleIcon.displayName = "RunmileCheckCircleIcon";
