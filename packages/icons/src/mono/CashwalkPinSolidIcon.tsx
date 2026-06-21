import React from "react";

export interface CashwalkPinSolidIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkPinSolidIcon = React.forwardRef<SVGSVGElement, CashwalkPinSolidIconProps>(
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
      <g clipPath="url(#clip0_30_436)">
<path d="M15.1172 3.85645C15.2635 3.71281 15.4987 3.71477 15.6436 3.86035L20.1338 8.37598L20.1367 8.37891C20.282 8.52365 20.282 8.75704 20.1387 8.90332C20.103 8.93819 20.0615 8.96617 20.0146 8.9834L19.9482 9.01172C17.8956 9.99491 16.646 11.125 15.9023 12.6143C15.1295 14.1587 14.6065 15.9474 14.6064 18.7529V18.7539C14.6065 18.9034 14.5162 19.0379 14.3779 19.0947L14.373 19.0967C14.3236 19.1174 14.2758 19.1269 14.2334 19.127C14.191 19.127 14.1432 19.1173 14.0938 19.0967L14.0859 19.0938L14.0244 19.0615C14.0052 19.0487 13.9871 19.0341 13.9707 19.0176L13.9688 19.0146L10.3262 15.373C10.0952 15.1422 9.74648 15.0906 9.46289 15.2314L9.3457 15.3037L6.74805 17.251L8.69629 14.6543C8.92015 14.3558 8.89069 13.9377 8.62695 13.6738L4.98438 10.0303C4.89096 9.93672 4.85478 9.80254 4.88574 9.67676L4.90332 9.62305C4.96306 9.48451 5.0989 9.39435 5.25 9.39355L5.24902 9.39258C8.05474 9.39228 9.84102 8.86807 11.4043 8.09668L11.4072 8.0957C12.8965 7.35108 14.0273 6.10168 15.0107 4.0498C15.0208 4.02886 15.03 4.00714 15.0381 3.98535C15.0558 3.9376 15.0822 3.89342 15.1172 3.85645Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_30_436">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkPinSolidIcon.displayName = "CashwalkPinSolidIcon";
