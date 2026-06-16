import React from "react";

export interface TrostBookmarkIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostBookmarkIcon = React.forwardRef<SVGSVGElement, TrostBookmarkIconProps>(
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
      <g clipPath="url(#clip0_5022_1554)">
<path d="M18.5 2.87012C19.0523 2.87012 19.5 3.31783 19.5 3.87012V21.0016C19.5 21.5539 19.0523 22.0017 18.5 22.0017C18.3026 22.0017 18.1096 21.9432 17.9453 21.8336L12.5547 18.2399C12.2188 18.016 11.7812 18.016 11.4453 18.2399L6.0547 21.8336C5.59517 22.14 4.9743 22.0158 4.66795 21.5563C4.55844 21.392 4.5 21.199 4.5 21.0016V3.87012C4.5 3.31783 4.94772 2.87012 5.5 2.87012H18.5ZM18 4.37012H6V20.0661L10.6132 16.9918C11.4005 16.467 12.4112 16.4342 13.2264 16.8934L13.3868 16.9918L18 20.0671V4.37012Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_5022_1554">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostBookmarkIcon.displayName = "TrostBookmarkIcon";
