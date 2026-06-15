import React from "react";

export interface GenietConditionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietConditionIcon = React.forwardRef<SVGSVGElement, GenietConditionIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="-0.78 -1.27 26.34 26.34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g clipPath="url(#clip0_3062_8855)">
<path d="M4.72783 2.50098H20.5389C21.2816 2.50098 21.8893 3.10866 21.8893 3.85139V21.6093C21.8893 22.352 21.2816 22.9597 20.5389 22.9597H5.18922C4.19892 22.9597 3.38867 22.1495 3.38867 21.1591V3.85139C3.38867 3.10866 3.99636 2.50098 4.73908 2.50098H4.72783Z" fill="url(#paint0_linear_3062_8855)"/>
<path d="M19.0647 0.835938H5.38053C4.27769 0.835938 3.38867 1.72496 3.38867 2.80529V21.6098H7.96881V19.7754H19.0759C20.1788 19.7754 21.0678 18.8864 21.0678 17.8061V2.80529C21.0678 1.7137 20.1788 0.835938 19.0759 0.835938H19.0647Z" fill="#65CD55"/>
<path d="M5.13295 19.7754H21.8893V22.0148C21.8893 22.5325 21.4617 22.9601 20.944 22.9601H4.81786C4.03012 22.9601 3.38867 22.3187 3.38867 21.5309C3.38867 20.5631 4.17641 19.7866 5.13295 19.7866V19.7754Z" fill="url(#paint1_linear_3062_8855)"/>
<path d="M4.91973 19.7754C4.91973 19.7754 4.81845 19.7754 4.77344 19.7866V20.5856C4.77344 21.1483 5.29109 21.6097 5.93254 21.6097H18.1087C18.7502 21.6097 19.2678 21.1483 19.2678 20.5856V19.7754H4.91973Z" fill="white"/>
<path d="M17.8922 3.09766H8.52448C8.10106 3.09766 7.75781 3.4409 7.75781 3.86432V6.5237C7.75781 6.94712 8.10106 7.29036 8.52448 7.29036H17.8922C18.3156 7.29036 18.6589 6.94712 18.6589 6.5237V3.86432C18.6589 3.4409 18.3156 3.09766 17.8922 3.09766Z" fill="#AFF0A6"/>
<path d="M2.89844 4.96387H4.64146" stroke="#247F21" strokeWidth="1.7" strokeLinecap="round"/>
<path d="M2.89844 8.76758H4.64146" stroke="#247F21" strokeWidth="1.7" strokeLinecap="round"/>
<path d="M2.89844 12.5713H4.64146" stroke="#247F21" strokeWidth="1.7" strokeLinecap="round"/>
<path d="M2.89844 16.375H4.64146" stroke="#247F21" strokeWidth="1.7" strokeLinecap="round"/>
</g>
<defs>
<linearGradient id="paint0_linear_3062_8855" x1="1667.42" y1="1941.87" x2="1010.55" y2="1992.72" gradientUnits="userSpaceOnUse">
<stop stopColor="#D6EFB3"/>
<stop offset="1" stopColor="#C5E9A7"/>
</linearGradient>
<linearGradient id="paint1_linear_3062_8855" x1="1832.12" y1="183.239" x2="1030.03" y2="192.904" gradientUnits="userSpaceOnUse">
<stop stopColor="#D6EFB3"/>
<stop offset="1" stopColor="#C5E9A7"/>
</linearGradient>
<clipPath id="clip0_3062_8855">
<rect width="20.125" height="23" fill="white" transform="translate(2 0.5)"/>
</clipPath>
</defs>
    </svg>
  )
);

GenietConditionIcon.displayName = "GenietConditionIcon";
