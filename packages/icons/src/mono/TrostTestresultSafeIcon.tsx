import React from "react";

export interface TrostTestresultSafeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostTestresultSafeIcon = React.forwardRef<SVGSVGElement, TrostTestresultSafeIconProps>(
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
      <g transform="scale(1.333333 1.333333)">
<path d="M5.5 7.06738H13.5275C14.8925 7.06738 16 8.17488 16 9.53988V13.5949C16 14.9599 14.8925 16.0674 13.5275 16.0674H5.5V7.06738Z" fill="currentColor"/>
<path d="M9 8.81743H5.5V3.96243C5.5 3.07493 6.0525 2.26743 6.8625 2.08243C7.9975 1.82243 9 2.73493 9 3.89743V8.81993V8.81743Z" fill="currentColor"/>
<path d="M4.56667 7.06738H2.93333C2.41787 7.06738 2 7.48525 2 8.00072V15.134C2 15.6495 2.41787 16.0674 2.93333 16.0674H4.56667C5.08213 16.0674 5.5 15.6495 5.5 15.134V8.00072C5.5 7.48525 5.08213 7.06738 4.56667 7.06738Z" fill="currentColor"/>
</g>
    </svg>
  )
);

TrostTestresultSafeIcon.displayName = "TrostTestresultSafeIcon";
