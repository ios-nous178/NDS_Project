import React from "react";

export interface TrostTestresultWarningIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostTestresultWarningIcon = React.forwardRef<SVGSVGElement, TrostTestresultWarningIconProps>(
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
<path d="M2.25129 16.2831C1.13581 16.2831 0.680509 15.4939 1.23825 14.5283L7.98618 2.83847C8.54392 1.87285 9.45642 1.87285 10.0123 2.83847L16.7621 14.5302C17.3198 15.4958 16.8626 16.285 15.749 16.285H2.25129V16.2831Z" fill="currentColor"/>
<path d="M9.57873 11.1191C9.56356 11.5061 9.25623 11.7053 8.9489 11.7053C8.64157 11.7053 8.34942 11.508 8.33425 11.1191L8.19576 7.56396C8.18058 7.19782 8.55431 6.98535 8.9489 6.98535C9.3435 6.98535 9.72481 7.19782 9.70963 7.56396L9.57873 11.1191ZM8.9508 12.2232C9.36816 12.2232 9.70394 12.559 9.70394 12.9612C9.70394 13.3633 9.36816 13.7143 8.9508 13.7143C8.53344 13.7143 8.20525 13.3785 8.20525 12.9612C8.20525 12.5438 8.54103 12.2232 8.9508 12.2232Z" fill="currentColor"/>
</g>
    </svg>
  )
);

TrostTestresultWarningIcon.displayName = "TrostTestresultWarningIcon";
