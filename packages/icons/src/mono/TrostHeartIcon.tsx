import React from "react";

export interface TrostHeartIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostHeartIcon = React.forwardRef<SVGSVGElement, TrostHeartIconProps>(
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
      <g clipPath="url(#clip0_5022_1231)">
<path d="M16.1552 3.75059L15.8649 3.75916C14.3885 3.84623 13.0216 4.50811 12.0543 5.57574L12 5.63791L11.9457 5.57574C10.9247 4.4488 9.45837 3.77394 7.88814 3.75C4.70964 3.88412 2.24926 6.42399 2.25 9.48887L2.25426 9.70865C2.25371 12.8404 4.90514 16.2537 9.12472 19.7226C10.7881 21.0925 13.2119 21.0925 14.8758 19.7221C18.9809 16.3475 21.6019 13.0249 21.7405 9.93661L21.7463 9.6798C21.8675 6.5463 19.3661 3.88731 16.1552 3.75059ZM7.90861 5.24923C9.31845 5.27198 10.6464 6.05285 11.347 7.29335L12 8.44972L12.6531 7.29335L12.7688 7.10134C13.4535 6.03545 14.6192 5.35012 15.9064 5.25958L16.108 5.24991L16.0914 5.24923C18.4132 5.3481 20.2271 7.20655 20.2498 9.44632L20.2469 9.65094C20.2463 12.2305 17.8073 15.3705 13.9227 18.5638C12.8122 19.4785 11.1878 19.4785 10.0778 18.5643C6.30376 15.4617 3.89426 12.41 3.75966 9.89986L3.75371 9.6798C3.66344 7.3208 5.51644 5.35109 7.90861 5.24923Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_5022_1231">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostHeartIcon.displayName = "TrostHeartIcon";
