import React from "react";

export interface GenietShoeIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const GenietShoeIcon = React.forwardRef<SVGSVGElement, GenietShoeIconProps>(
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
      <path d="M16.4008 6.41964C16.0408 5.78964 15.5808 5.28964 14.8008 5.02964C13.8508 4.70964 13.0008 5.10964 13.0008 5.10964C13.0008 5.10964 11.8308 5.52964 10.7208 4.74964C9.84083 4.12964 9.70083 3.55964 9.54083 3.03964C9.52083 2.96964 9.38083 2.69964 9.38083 2.69964C8.53083 1.47964 6.78083 1.59964 5.99083 2.85964L2.32083 8.57964C1.31083 10.1696 1.78083 12.2896 3.38083 13.2996L16.7708 21.7796C16.7708 21.7796 19.6308 22.8796 21.5008 20.0396C21.5008 20.0396 23.1508 17.8796 21.4308 15.3296L16.4008 6.44964V6.41964Z" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10"/>
<path d="M2.31055 8.56934L20.8005 20.3893" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10"/>
<path d="M17.7409 8.80957L13.8809 11.0696" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10" strokeLinecap="round"/>
<path d="M18.8118 11.4492L16.0918 13.0492" stroke="currentColor" strokeWidth="1.7" strokeMiterlimit="10" strokeLinecap="round"/>
    </svg>
  )
);

GenietShoeIcon.displayName = "GenietShoeIcon";
