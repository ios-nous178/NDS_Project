import React from "react";

export interface CashwalkPeopleIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkPeopleIcon = React.forwardRef<SVGSVGElement, CashwalkPeopleIconProps>(
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
      <mask id="mask0_30_690" maskUnits="userSpaceOnUse" x="2" y="12" width="9" height="7">
<path fillRule="evenodd" clipRule="evenodd" d="M2 12.8342H10.5474V18.8729H2V12.8342Z" fill="white"/>
</mask>
<g mask="url(#mask0_30_690)">
<path fillRule="evenodd" clipRule="evenodd" d="M10.5474 13.2312C9.60737 12.9702 8.63737 12.8372 7.66137 12.8342C3.28337 13.0442 1.86737 15.8832 2.00737 17.3612C2.10837 18.4502 5.89637 19.0022 9.16337 18.8472C9.05337 18.7872 8.95137 18.7132 8.85937 18.6292C7.70837 17.2132 8.68037 15.0122 10.5474 13.2312Z" fill="#CCCCCC"/>
</g>
<mask id="mask1_30_690" maskUnits="userSpaceOnUse" x="9" y="12" width="13" height="7">
<path fillRule="evenodd" clipRule="evenodd" d="M9.58862 12.8346H21.4634V18.878H9.58862V12.8346Z" fill="white"/>
</mask>
<g mask="url(#mask1_30_690)">
<path fillRule="evenodd" clipRule="evenodd" d="M15.2529 12.8346C10.8739 13.0446 9.45795 15.8836 9.59795 17.3616C9.77695 19.2356 20.8059 19.5316 21.4439 17.3616C21.5999 16.8166 20.9309 12.8886 15.2529 12.8346Z" fill="#999999"/>
</g>
<path fillRule="evenodd" clipRule="evenodd" d="M15.5019 11.909C17.2719 11.909 18.7059 10.474 18.7059 8.705C18.7059 6.935 17.2719 5.5 15.5019 5.5C13.7319 5.5 12.2979 6.935 12.2979 8.705C12.2979 10.474 13.7319 11.909 15.5019 11.909Z" fill="#999999"/>
<path fillRule="evenodd" clipRule="evenodd" d="M7.83285 11.909C9.60285 11.909 11.0368 10.474 11.0368 8.705C11.0368 6.935 9.60285 5.5 7.83285 5.5C6.06285 5.5 4.62885 6.935 4.62885 8.705C4.62885 10.474 6.06285 11.909 7.83285 11.909Z" fill="#CCCCCC"/>
    </svg>
  )
);

CashwalkPeopleIcon.displayName = "CashwalkPeopleIcon";
