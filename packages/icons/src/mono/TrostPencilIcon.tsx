import React from "react";

export interface TrostPencilIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostPencilIcon = React.forwardRef<SVGSVGElement, TrostPencilIconProps>(
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
      <g clipPath="url(#clip0_5022_1487)">
<path d="M13.42 6.41L17.59 10.58M4 20L9.21906 18.9562L19.1353 9.03997C19.4094 8.76582 19.6269 8.44036 19.7753 8.08216C19.9236 7.72397 20 7.34005 20 6.95235C20 6.56464 19.9236 6.18073 19.7753 5.82253C19.6269 5.46434 19.4094 5.13887 19.1353 4.86472C18.8611 4.59057 18.5357 4.3731 18.1775 4.22473C17.8193 4.07637 17.4354 4 17.0477 4C16.6599 4 16.276 4.07637 15.9178 4.22473C15.5596 4.3731 15.2342 4.59057 14.96 4.86472L5.04381 14.7809L4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_5022_1487">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

TrostPencilIcon.displayName = "TrostPencilIcon";
