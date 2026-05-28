import React from "react";

export interface TrostMentalSoundIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalSoundIcon = React.forwardRef<SVGSVGElement, TrostMentalSoundIconProps>(
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
      <g transform="scale(0.75 0.75)">
<g clipPath="url(#xa02lrneca)">
        <circle cx="7.5" cy="23" r="5" fill="currentColor"/>
        <path d="M11 22.5v-16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9.505" y="5" width="6.995" height="5" rx="1" fill="currentColor"/>
        <circle cx="22.5" cy="23" r="5" fill="currentColor"/>
        <path d="M26 23v-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m25.123 11.592.328-.755a5.813 5.813 0 0 1 2.958-3.001l1.014-.45a.707.707 0 0 0 0-1.283l-.958-.427a5.827 5.827 0 0 1-3-3.103l-.337-.813a.674.674 0 0 0-1.256 0l-.337.815a5.827 5.827 0 0 1-3.002 3.101l-.956.425a.707.707 0 0 0 0 1.284l1.012.452a5.814 5.814 0 0 1 2.96 3l.328.755a.675.675 0 0 0 1.246 0z" fill="currentColor"/>
    </g>
    <defs>
        <clipPath id="xa02lrneca">
</clipPath>
    </defs>
</g>
    </svg>
  )
);

TrostMentalSoundIcon.displayName = "TrostMentalSoundIcon";
