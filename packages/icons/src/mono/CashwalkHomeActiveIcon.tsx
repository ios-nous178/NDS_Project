import React from "react";

export interface CashwalkHomeActiveIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkHomeActiveIcon = React.forwardRef<SVGSVGElement, CashwalkHomeActiveIconProps>(
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
      <g clipPath="url(#clip0_30_226)">
<path fillRule="evenodd" clipRule="evenodd" d="M13.9896 22.0805C13.9896 22.6328 14.4373 23.0805 14.9896 23.0805H19.4896C20.0419 23.0805 20.4896 22.6328 20.4896 22.0805V11.5805L21.8907 12.8673C22.2853 13.2297 22.8954 13.2167 23.2743 12.8379L23.3035 12.8086C23.694 12.4181 23.694 11.7849 23.3035 11.3944L13.4146 1.5055C12.6335 0.724379 11.3664 0.724103 10.5856 1.5055L3.01059 9.0795L2.98959 9.0805V9.1005L0.696462 11.3944C0.306049 11.7849 0.306102 12.418 0.69658 12.8085L0.726059 12.838C1.10484 13.2168 1.71482 13.2298 2.10943 12.8675L3.48959 11.6005V22.0805C3.48959 22.6328 3.9373 23.0805 4.48959 23.0805H8.98959C9.54187 23.0805 9.98959 22.6328 9.98959 22.0805V20.5805V18.5805C9.98959 18.0282 10.4373 17.5805 10.9896 17.5805H12.9896C13.5419 17.5805 13.9896 18.0282 13.9896 18.5805V22.0805Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_30_226">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
    </svg>
  )
);

CashwalkHomeActiveIcon.displayName = "CashwalkHomeActiveIcon";
