import React from "react";

export interface GenietShoeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietShoeIcon = React.forwardRef<SVGSVGElement, GenietShoeIconProps>(
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
      <path fill="#2CAEC5" d="M2.991 8.084c-.283.72-1.138 2.516-.964 3.293.22.992.805 1.834 1.637 2.386L15.908 21.7l.1.056c.348.14.832.244 1.39.244.86 0 2.866-1.201 3.753-2.006L2.991 8.084Z"/>
  <path fill="#36CEE9" d="M21.232 19.907a3.11 3.11 0 0 1-.073.093L3 8.092l3.074-4.87c.457-.745 1.235-1.201 2.076-1.22.814-.037 1.537.364 2.013 1.053.046.065.21.4.238.493.137.493.238.838.85 1.276.741.53 1.51.27 1.546.26a2.922 2.922 0 0 1 2.04-.074c.778.27 1.345.763 1.793 1.573l.96 1.723.586 1.052.677 1.22c-.009 0 .043.072.043.072l.524.97 1.784 3.213c1.409 2.16.64 4.264.028 5.074Z"/>
  <path fill="#D2FBFF" d="M16.99 7.94a.932.932 0 0 1 .942 1.607l-2.255 1.322a.932.932 0 1 1-.943-1.607l2.255-1.323Zm1.3 2.266a.932.932 0 1 1 .943 1.607l-2.255 1.323a.932.932 0 1 1-.943-1.607l2.255-1.323Z"/>
    </svg>
  )
);

GenietShoeIcon.displayName = "GenietShoeIcon";
