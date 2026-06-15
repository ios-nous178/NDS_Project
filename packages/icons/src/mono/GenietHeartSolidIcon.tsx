import React from "react";

export interface GenietHeartSolidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietHeartSolidIcon = React.forwardRef<SVGSVGElement, GenietHeartSolidIconProps>(
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
      <path d="M16.6404 3.25C20.0898 3.25025 22.4644 6.35834 22.3719 9.91895C22.3331 11.4101 21.7247 12.8786 20.8778 14.21C20.0269 15.5473 18.9026 16.798 17.7547 17.8652C16.6055 18.9336 15.4139 19.8365 14.4119 20.4766C13.9117 20.7961 13.4471 21.0572 13.0516 21.2412C12.6939 21.4076 12.2805 21.5654 11.9256 21.5654C11.5622 21.5654 11.1468 21.4112 10.7801 21.2412C10.3808 21.0561 9.91851 20.7942 9.42463 20.4736C8.43542 19.8316 7.27285 18.9265 6.159 17.8564C5.0464 16.7875 3.9643 15.5359 3.15119 14.1973C2.34114 12.8635 1.77002 11.396 1.7508 9.90918C1.72502 7.93414 2.32309 6.26656 3.38947 5.08398C4.45858 3.89859 5.95551 3.25 7.61799 3.25C9.42457 3.25006 11.0289 4.05142 12.1287 5.30273C13.2286 4.05122 14.8337 3.25 16.6404 3.25Z" fill="currentColor"/>
    </svg>
  )
);

GenietHeartSolidIcon.displayName = "GenietHeartSolidIcon";
