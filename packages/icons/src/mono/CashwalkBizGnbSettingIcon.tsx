import React from "react";

export interface CashwalkBizGnbSettingIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizGnbSettingIcon = React.forwardRef<SVGSVGElement, CashwalkBizGnbSettingIconProps>(
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
      <g transform="scale(1.371429 1.370403)">
<g id="ic_teamwalk_mypage_black">
<path id="shape" fillRule="evenodd" clipRule="evenodd" d="M8.74685 9.57691C10.9707 9.57691 12.9876 10.3587 14.4462 11.6343C15.862 12.8726 16.75 14.5798 16.75 16.4729L0.750034 16.75C0.743692 14.5798 1.63165 12.8726 3.04752 11.6343C4.50611 10.3587 6.523 9.57691 8.74685 9.57691ZM8.58871 0.75C9.40516 0.75 10.1443 1.08077 10.6794 1.61556C11.2144 2.15035 11.5453 2.88916 11.5453 3.70522C11.5453 4.52128 11.2144 5.26009 10.6794 5.79488C10.1443 6.32967 9.40516 6.66044 8.58871 6.66044C7.77227 6.66044 7.03311 6.32967 6.49807 5.79488C5.96303 5.26009 5.6321 4.52128 5.6321 3.70522C5.6321 2.88916 5.96303 2.15035 6.49807 1.61556C7.03311 1.08077 7.77227 0.75 8.58871 0.75Z" stroke="currentColor" strokeWidth="1.5"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizGnbSettingIcon.displayName = "CashwalkBizGnbSettingIcon";
