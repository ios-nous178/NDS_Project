import React from "react";

export interface GenietHeartWhiteShadowIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietHeartWhiteShadowIcon = React.forwardRef<SVGSVGElement, GenietHeartWhiteShadowIconProps>(
  ({ size = 24, color = "currentColor", ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      color={color}
      {...props}
    >
      <g filter="url(#filter0_d_3001_151020)">
<path d="M19.6404 6.25C23.0899 6.25014 25.4644 9.35828 25.3719 12.9189C25.3331 14.4101 24.7248 15.8786 23.8778 17.21C23.0269 18.5473 21.9026 19.798 20.7547 20.8652C19.6055 21.9337 18.4139 22.8365 17.4119 23.4766C16.9116 23.7962 16.4471 24.0572 16.0516 24.2412C15.6938 24.4076 15.2805 24.5654 14.9256 24.5654C14.5622 24.5654 14.1469 24.4112 13.7801 24.2412C13.3807 24.0561 12.9186 23.7942 12.4246 23.4736C11.4354 22.8315 10.2729 21.9265 9.159 20.8564C8.04638 19.7875 6.96431 18.536 6.15119 17.1973C5.34114 15.8635 4.77001 14.396 4.7508 12.9092C4.72502 10.9341 5.32309 9.26656 6.38947 8.08398C7.45859 6.89853 8.95547 6.25 10.618 6.25C12.4246 6.25 14.0289 7.05138 15.1287 8.30273C16.2286 7.05117 17.8336 6.25 19.6404 6.25ZM19.6404 7.75C17.9992 7.75 16.5695 8.6316 15.7703 9.95117C15.6344 10.1756 15.3911 10.3125 15.1287 10.3125C14.8665 10.3124 14.623 10.1755 14.4871 9.95117C13.6879 8.63178 12.2591 7.75 10.618 7.75C9.35939 7.75 8.27389 8.2337 7.50275 9.08887C6.72904 9.94704 6.22911 11.2291 6.2508 12.8896C6.26532 14.0133 6.7031 15.2155 7.43342 16.418C8.16059 17.6152 9.14958 18.7671 10.1981 19.7744C11.2454 20.7806 12.3338 21.6259 13.241 22.2148C13.6954 22.5097 14.0943 22.7331 14.411 22.8799C14.5693 22.9532 14.6976 23.004 14.7957 23.0342C14.8747 23.0585 14.9155 23.0641 14.9256 23.0654C14.932 23.0634 15.0808 23.0385 15.4197 22.8809C15.7375 22.733 16.1413 22.5077 16.6043 22.2119C17.5292 21.6211 18.6494 20.7743 19.7332 19.7666C20.8186 18.7574 21.8494 17.6041 22.6121 16.4053C23.3786 15.2005 23.8428 13.9991 23.8719 12.8799C23.9484 9.93312 22.0332 7.75014 19.6404 7.75Z" fill="white"/>
</g>
<defs>
<filter id="filter0_d_3001_151020" x="0" y="0" width="30" height="30" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="1.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3001_151020"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_3001_151020" result="shape"/>
</filter>
</defs>
    </svg>
  )
);

GenietHeartWhiteShadowIcon.displayName = "GenietHeartWhiteShadowIcon";
