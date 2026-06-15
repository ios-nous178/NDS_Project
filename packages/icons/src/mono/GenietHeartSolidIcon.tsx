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
      viewBox="0 0 21 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path fill="currentColor" d="M14.89 0c3.45 0 5.824 3.108 5.732 6.669-.039 1.491-.647 2.96-1.494 4.291-.851 1.337-1.975 2.588-3.123 3.655a24.23 24.23 0 0 1-3.343 2.612c-.5.32-.965.58-1.36.764-.358.167-.771.324-1.126.324-.364 0-.78-.154-1.146-.324-.4-.185-.861-.447-1.355-.767a22.746 22.746 0 0 1-3.266-2.618c-1.113-1.069-2.195-2.32-3.008-3.659C.591 9.614.02 8.146.001 6.66c-.026-1.975.572-3.642 1.638-4.825C2.71.649 4.206 0 5.868 0a5.98 5.98 0 0 1 4.51 2.053A5.986 5.986 0 0 1 14.89 0Z"/>
    </svg>
  )
);

GenietHeartSolidIcon.displayName = "GenietHeartSolidIcon";
