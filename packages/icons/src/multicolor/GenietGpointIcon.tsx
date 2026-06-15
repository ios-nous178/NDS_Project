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
      <path fill="currentColor" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"/>
  <path fill="#fff" d="M12.23 17.56h-.21c-.74-.03-1.62-.07-2.68-.72-2.43-1.49-2.66-4.01-2.64-5.02.03-1.95.9-3.63 2.4-4.61 1.75-1.16 4.82-1.2 6.9.72.48.44.51 1.18.07 1.66s-1.19.51-1.66.07c-1.18-1.09-3.02-1.13-4.01-.48-.85.56-1.32 1.51-1.34 2.68-.01.76.17 2.15 1.52 2.99.53.33.94.35 1.46.37.92.05 1.9-.36 2.14-.82.11-.21.16-.42.15-.65v-.12h-1.79c-.65 0-1.18-.53-1.18-1.18 0-.65.53-1.18 1.18-1.18h2.97c.65 0 1.18.53 1.18 1.18v1.27c.01.59-.12 1.2-.41 1.76-.72 1.41-2.53 2.11-4.03 2.11l-.02-.03Z"/>
    </svg>
  )
);

GenietGpointIcon.displayName = "GenietGpointIcon";
