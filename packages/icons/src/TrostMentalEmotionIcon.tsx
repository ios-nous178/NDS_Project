import React from "react";

export interface TrostMentalEmotionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const TrostMentalEmotionIcon = React.forwardRef<SVGSVGElement, TrostMentalEmotionIconProps>(
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
<g clipPath="url(#vo3pgfxvsa)">
        <path d="M15 3c7.18 0 13 5.82 13 13 0 .283-.01.564-.028.842l-7.853 7.556a2 2 0 0 0-.561.99l-.703 3.03A12.996 12.996 0 0 1 15 29C7.82 29 2 23.18 2 16S7.82 3 15 3zm4.25 16.218a1 1 0 0 0-.714.318 4.999 4.999 0 0 1-7.072 0 1 1 0 0 0-1.413 1.413 7 7 0 0 0 9.898 0 1 1 0 0 0-.699-1.731zM11.5 11c-.72 0-1.104.559-1.248.846-.171.36-.257.755-.252 1.154 0 .397.079.806.252 1.154.144.287.527.846 1.248.846.72 0 1.104-.559 1.248-.846.173-.346.252-.757.252-1.154 0-.397-.079-.806-.252-1.154-.144-.287-.527-.846-1.248-.846zm7 0c-.721 0-1.104.559-1.248.846A2.621 2.621 0 0 0 17 13c-.005.399.081.794.252 1.154.144.287.528.846 1.248.846.721 0 1.104-.559 1.248-.846.173-.348.252-.757.252-1.154 0-.397-.079-.808-.252-1.154-.144-.287-.528-.846-1.248-.846z" fill="currentColor"/>
        <path d="m21.193 25.758-.67 2.894a.727.727 0 0 0 .705.882.7.7 0 0 0 .152 0l2.911-.67 5.59-5.569-3.12-3.112-5.568 5.575zM31.74 20.405l-2.082-2.082a.73.73 0 0 0-1.03 0L27.47 19.48l3.116 3.116 1.157-1.157a.73.73 0 0 0-.003-1.034z" fill="currentColor"/>
    </g>
    <defs>
        <clipPath id="vo3pgfxvsa">
</clipPath>
    </defs>
</g>
    </svg>
  )
);

TrostMentalEmotionIcon.displayName = "TrostMentalEmotionIcon";
