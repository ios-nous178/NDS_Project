import React from "react";

export interface GenietShoeFillIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietShoeFillIcon = React.forwardRef<SVGSVGElement, GenietShoeFillIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="-2.23 -2.67 26.76 26.76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <path fill="currentColor" d="M19.93 20.333c-.97.86-2.081 1.13-3.021 1.13-.61 0-1.14-.111-1.52-.261l-.11-.06-13.39-8.48a4.109 4.109 0 0 1-1.79-2.55c-.19-.83-.1-1.66.21-2.43l19.62 12.65ZM6.58.003c.89-.04 1.679.39 2.199 1.13.05.07.23.43.26.53.15.53.26.899.93 1.369.808.568 1.645.292 1.69.28.06-.03 1.07-.47 2.23-.08.85.29 1.47.82 1.96 1.69l1.05 1.85-4.45 2.56c-.31.18-.42.58-.24.89.12.21.33.33.56.33.11 0 .22-.03.32-.09l4.45-2.56.74 1.31h-.03l-3.6 2.09a.645.645 0 0 0 .32 1.21c.11 0 .23-.03.33-.09l3.6-2.09 1.95 3.45c1.54 2.32.7 4.58.03 5.45-.03.04-.08.1-.08.1L.95 6.543l3.36-5.23c.5-.8 1.35-1.29 2.27-1.31Z"/>
    </svg>
  )
);

GenietShoeFillIcon.displayName = "GenietShoeFillIcon";
