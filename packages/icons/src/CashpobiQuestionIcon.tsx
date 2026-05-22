import React from "react";

export interface CashpobiQuestionIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CashpobiQuestionIcon = React.forwardRef<SVGSVGElement, CashpobiQuestionIconProps>(
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
      <g transform="scale(1.2 1.2)">
<g id="shape">
<path id="Shape" fillRule="evenodd" clipRule="evenodd" d="M10.8333 11.1252C10.8199 10.8349 10.9939 10.5653 11.275 10.4405V10.4328C12.4889 9.9644 13.295 8.87416 13.3338 7.64841C13.3725 6.42265 12.6367 5.28992 11.4545 4.75553C10.2723 4.22113 8.8642 4.38472 7.85833 5.17331C7.10412 5.76372 6.66793 6.63514 6.66667 7.55407C6.66667 7.98376 7.03976 8.33209 7.5 8.33209C7.96024 8.33209 8.33333 7.98376 8.33333 7.55407C8.33334 6.77262 8.95413 6.11239 9.78407 6.01115C10.614 5.90991 11.3956 6.39906 11.6107 7.15427C11.8258 7.90948 11.4075 8.69647 10.6333 8.99341C9.72733 9.35711 9.14747 10.1968 9.16667 11.1174V11.4442C9.16667 11.8739 9.53976 12.2222 10 12.2222C10.4602 12.2222 10.8333 11.8739 10.8333 11.4442V11.1252ZM9.16667 14.7222C9.16667 15.1825 9.53976 15.5556 10 15.5556C10.4602 15.5556 10.8333 15.1825 10.8333 14.7222C10.8333 14.262 10.4602 13.8889 10 13.8889C9.53976 13.8889 9.16667 14.262 9.16667 14.7222Z" fill="currentColor"/>
<circle id="Oval" cx="10" cy="10" r="9.09091" stroke="currentColor" strokeWidth="1.81818"/>
</g>
</g>
    </svg>
  )
);

CashpobiQuestionIcon.displayName = "CashpobiQuestionIcon";
