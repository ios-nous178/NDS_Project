import React from "react";

export interface CashwalkBizGnbChatIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashwalkBizGnbChatIcon = React.forwardRef<SVGSVGElement, CashwalkBizGnbChatIconProps>(
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
      <g transform="scale(1.0932 1.093653)">
<g id="Ic/bubble/line">
<path id="&#237;&#140;&#168;&#236;&#138;&#164;_5059" fillRule="evenodd" clipRule="evenodd" d="M6.61612 20.2175C9.08392 21.3833 11.916 21.5114 14.479 20.5733C17.042 19.6351 19.1221 17.709 20.2541 15.2255C21.5284 12.5687 21.52 9.47542 20.2313 6.82552C18.7487 3.45553 15.5608 1.1498 11.896 0.796953C8.23127 0.444109 4.66193 2.09924 2.56363 5.12447C0.465319 8.1497 0.165655 12.0727 1.78012 15.3815C1.81304 15.4501 1.82434 15.5271 1.81252 15.6023L1.10452 20.0051C1.06524 20.2509 1.14619 20.5006 1.32219 20.6767C1.4982 20.8527 1.74793 20.9336 1.99372 20.8943L6.39532 20.1851C6.47051 20.1737 6.54739 20.185 6.61612 20.2175Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path id="&#237;&#140;&#168;&#236;&#138;&#164;_5060" d="M11.0057 9.62272C11.7878 9.62272 12.4217 10.2567 12.4217 11.0387C12.4217 11.8208 11.7878 12.4547 11.0057 12.4547C10.2237 12.4547 9.58972 11.8208 9.58972 11.0387C9.59038 10.257 10.224 9.62338 11.0057 9.62272Z" fill="currentColor"/>
<path id="&#237;&#140;&#168;&#236;&#138;&#164;_5061" d="M15.3233 9.62272C16.1054 9.62272 16.7393 10.2567 16.7393 11.0387C16.7393 11.8208 16.1054 12.4547 15.3233 12.4547C14.5413 12.4547 13.9073 11.8208 13.9073 11.0387C13.908 10.257 14.5416 9.62338 15.3233 9.62272Z" fill="currentColor"/>
<path id="&#237;&#140;&#168;&#236;&#138;&#164;_5062" d="M6.68812 9.62272C7.47016 9.62272 8.10412 10.2567 8.10412 11.0387C8.10412 11.8208 7.47016 12.4547 6.68812 12.4547C5.90609 12.4547 5.27212 11.8208 5.27212 11.0387C5.27278 10.257 5.90636 9.62338 6.68812 9.62272Z" fill="currentColor"/>
</g>
</g>
    </svg>
  )
);

CashwalkBizGnbChatIcon.displayName = "CashwalkBizGnbChatIcon";
