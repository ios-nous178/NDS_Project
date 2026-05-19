import React from "react";

export interface GenietCopyIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietCopyIcon = React.forwardRef<SVGSVGElement, GenietCopyIconProps>(
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
      <g fill="none" fillRule="evenodd">
<g stroke="currentColor" strokeWidth="1.5">
            <path d="M16.674 16.686h1.435c1.118 0 2.024-.877 2.024-1.959V5.96C20.134 4.877 19.228 4 18.11 4h-6.502c-1.119 0-2.025.877-2.025 1.959v.3"/>
            <path d="M12.527 8.224H6.025c-1.12 0-2.025.877-2.025 1.96v8.768c0 1.081.906 1.958 2.025 1.958h6.502c1.118 0 2.024-.877 2.024-1.958v-8.769c0-1.082-.906-1.959-2.024-1.959z"/>
        </g>
    </g>
    </svg>
  )
);

GenietCopyIcon.displayName = "GenietCopyIcon";
